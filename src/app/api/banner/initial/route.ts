import { NextRequest } from "next/server";
import Sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: "ducsu6916",
  api_key: "254453765841711",
  api_secret: "t-h1i9ls6zX-CQRy4d5brCWzh98",
});

export async function POST(req: NextRequest) {
  try {
    const { question, option1, option2, option3 } = await req.json();

    // Create an SVG with the text and styling
    const svgImage = `
            <svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
                <!-- Gradient Background -->
                <defs>
                    <radialGradient id="grad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" style="stop-color:#2a0c63;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#4e048d;stop-opacity:1" />
                    </radialGradient>
                </defs>
                
                <!-- Background -->
                <rect width="800" height="800" fill="url(#grad)"/>
                
                <!-- Question Text -->
                <text x="400" y="100" 
                    font-size="40" 
                    font-weight="bold" 
                    fill="white" 
                    text-anchor="middle">
                    ${question}
                </text>
                
                <!-- Options -->
                <text x="400" y="300"  
                    font-size="36" 
                    fill="#34c759" 
                    text-anchor="middle">
                    ${option1}
                </text>
                
                <text x="400" y="400" 
                    font-size="36" 
                    fill="#ff9500" 
                    text-anchor="middle">
                    ${option2}
                </text>
                
                <text x="400" y="500" 
                    font-size="36" 
                    fill="#ff2d55" 
                    text-anchor="middle">
                    ${option3}
                </text>
            </svg>
        `;

    // Convert SVG to PNG using Sharp
    const buffer = await Sharp(Buffer.from(svgImage)).png().toBuffer();

    // Upload to Cloudinary
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "banners" },
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result.url);
          }
        );
        uploadStream.end(buffer);
      });
    };

    const imageUrl: any = await uploadToCloudinary();
    return new Response(JSON.stringify({ imageUrl }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
}
/*whenever a person comes clicks on the start button thereafter he/she gets automatically gets an random task with three options and chooses one afterthat, 
    then he/she is asked the url of the image that he performed action for and prompt the task is completed,
        thereAfter he/she gets a chance to mint an Nft of that task with the image uploaded,
            and then he/she gets a chance to vote the task like how was it ? like kind of rating...

    So this will be the api structure 
    api/banner/initial  (for printing out the inintial random task banner)
    api/banner/finalNft (for making the final completed task nft with the uploaded image)

    api/randomTask :  to generate the random task out of all the tasks 
    
    api/actions/game :
    (the api for overall blinks initialization and random task making and assigning it to the banner then showing it in the blink icon)

    api/actions/game/chooose :
    (this will be the api for the passing the chosen task info and it will also be responsible for taking task performance image TPI URL and pass on it as a parameter )

    api/actions/game/mint : 
    (this api will be used to mint the final banner image nft with the users wallet)


    additional func apis: 
    (these apis are not that much important but can be used additionaly to enhance the functionality of the blink)

    api/actions/game/restart
    (to restart the whole game)

    api/actions/game/vote
    (To vote for the task like to contribute to rank the task)



*/
