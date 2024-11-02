import { createCanvas, registerFont } from 'canvas';
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest } from 'next/server';
import path from 'path';

registerFont(('./public/fonts/Roboto.ttf'), { family: 'Roboto' });

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: "ducsu6916",
    api_key: "254453765841711",
    api_secret: "t-h1i9ls6zX-CQRy4d5brCWzh98",
});

export async function POST(req: NextRequest) {
    const { question, option1, option2, option3 } = await req.json();
    
    // Create the canvas with the banner
    const canvas = createCanvas(800, 800);
    const ctx = canvas.getContext('2d');
    
    // Dark gradient background
    const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 100,
        canvas.width / 2, canvas.height / 2, 400
    );
    gradient.addColorStop(0, '#2a0c63');
    gradient.addColorStop(1, '#4e048d');
    
    // Fill background with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw question text
    ctx.fillStyle = '#ffffff';  // White text for question
    ctx.font = 'bold 40px Roboto';
    ctx.textAlign = 'center';
    ctx.fillText(question, canvas.width / 2, 100);

    // Draw the options
    ctx.fillStyle = '#34c759';  // Green for option 1
    ctx.font = '36px Roboto';
    ctx.fillText(option1, canvas.width / 2, 300);

    ctx.fillStyle = '#ff9500';  // Orange for option 2
    ctx.fillText(option2, canvas.width / 2, 400);

    ctx.fillStyle = '#ff2d55';  // Red for option 3
    ctx.fillText(option3, canvas.width / 2, 500);

    // Convert canvas to buffer
    const buffer = canvas.toBuffer('image/png');

    // Function to upload image to Cloudinary
    const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'banners' },  // Optional: Save to a specific folder in Cloudinary
                (error: any, result: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.url);  // Get the URL from Cloudinary
                    }
                }
            );
            uploadStream.end(buffer);  // Send the image buffer to Cloudinary
        });
    };

    try {
        // Upload the image to Cloudinary and get the result URL
        const imageUrl: any = await uploadToCloudinary();
        return new Response( `and here is the context: ${ctx} and font : ${ctx.font} ${JSON.stringify(imageUrl)}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to upload image' }), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 500,
        });
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