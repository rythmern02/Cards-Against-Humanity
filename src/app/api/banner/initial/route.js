import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "ducsu6916",
  api_key: "254453765841711",
  api_secret: "t-h1i9ls6zX-CQRy4d5brCWzh98",
});


export async function POST(req) {
  try {
    const { question, option1, option2, option3 } = await req.json();

    const img = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, #2a0c63, #4e048d)',
            fontSize: 32,
            fontWeight: 600,
          }}
        >
          <div style={{ color: 'white', marginBottom: 40, textAlign: 'center', padding: '0 20px' }}>
            {question}
          </div>
          <div style={{ color: '#34c759', marginBottom: 20, textAlign: 'center', padding: '0 20px' }}>
            {option1}
          </div>
          <div style={{ color: '#ff9500', marginBottom: 20, textAlign: 'center', padding: '0 20px' }}>
            {option2}
          </div>
          <div style={{ color: '#ff2d55', textAlign: 'center', padding: '0 20px' }}>
            {option3}
          </div>
        </div>
      ),
      {
        width: 800,
        height: 800,
      }
    );

    const buffer = await img.arrayBuffer();

    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "banners" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              console.log("Cloudinary upload success:", result?.url);
              resolve(result?.url || '');
            }
          }
        );
        uploadStream.end(Buffer.from(buffer));
      });
    };

    const imageUrl = await uploadToCloudinary();
    return new Response(JSON.stringify({ imageUrl }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
}
// /*whenever a person comes clicks on the start button thereafter he/she gets automatically gets an random task with three options and chooses one afterthat, 
//     then he/she is asked the url of the image that he performed action for and prompt the task is completed,
//         thereAfter he/she gets a chance to mint an Nft of that task with the image uploaded,
//             and then he/she gets a chance to vote the task like how was it ? like kind of rating...

//     So this will be the api structure 
//     api/banner/initial  (for printing out the inintial random task banner)
//     api/banner/finalNft (for making the final completed task nft with the uploaded image)

//     api/randomTask :  to generate the random task out of all the tasks 
    
//     api/actions/game :
//     (the api for overall blinks initialization and random task making and assigning it to the banner then showing it in the blink icon)

//     api/actions/game/chooose :
//     (this will be the api for the passing the chosen task info and it will also be responsible for taking task performance image TPI URL and pass on it as a parameter )

//     api/actions/game/mint : 
//     (this api will be used to mint the final banner image nft with the users wallet)


//     additional func apis: 
//     (these apis are not that much important but can be used additionaly to enhance the functionality of the blink)

//     api/actions/game/restart
//     (to restart the whole game)

//     api/actions/game/vote
//     (To vote for the task like to contribute to rank the task)

