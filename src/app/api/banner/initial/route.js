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
            justifyContent: 'space-between',
            background: 'radial-gradient(circle, #0a0216, #120324, #1b0134)',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            padding: '20px',
          }}
        >
          <div style={{
            fontSize: 36,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '15px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3), 0 0 10px rgba(255,255,255,0.1)',
            textShadow: '0 0 10px rgba(255,255,255,0.5)',
          }}>
            Welcome to the Dark Side of Humanity
          </div>
          <div style={{
            fontSize: 28,
            fontWeight: 600,
            marginBottom: 20,
            textAlign: 'center',
            padding: '15px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
          }}>
            {question}
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 15,
            width: '100%',
          }}>
            {[
              { text: option1, color: '#34c759' },
              { text: option2, color: '#ff9500' },
              { text: option3, color: '#ff2d55' },
            ].map((option, index) => (
              <div key={index} style={{
                color: option.color,
                fontSize: 24,
                textAlign: 'center',
                padding: '10px 15px',
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '8px',
                border: `1px solid ${option.color}`,
                boxShadow: `0 2px 4px rgba(0,0,0,0.2), 0 0 10px ${option.color}40`,
                width: '90%',
              }}>
                {option.text}
              </div>
            ))}
          </div>
          <div style={{
            fontSize: 20,
            marginTop: 20,
            textAlign: 'center',
            padding: '15px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            maxWidth: '90%',
          }}>
            Perform this twisted task, capture your darkest self, and share the evidence through the digital void.
          </div>
          <div style={{
            fontSize: 16,
            marginTop: 15,
            textAlign: 'center',
            padding: '10px',
            color: 'rgba(255,255,255,0.7)',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '8px',
            maxWidth: '90%',
          }}>
            Upload your soul-capturing image to the cloud and paste its essence here to complete your task and mint your NFTs.
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

