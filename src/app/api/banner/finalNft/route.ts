import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, loadImage } from 'canvas';
import axios from 'axios';
import FormData from 'form-data';
import sharp from 'sharp'; // Add this for format conversion

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY!;
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY!;
const PINATA_FILE_ENDPOINT = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

// Function to upload image to Pinata
const uploadToPinata = async (buffer: Buffer) => {
  const formData = new FormData();
  formData.append('file', buffer, 'image.png');

  const response = await axios.post(PINATA_FILE_ENDPOINT, formData, {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  });

  return `https://ipfs.io/ipfs/${response.data.IpfsHash}`;
};

// Function to convert specific URLs to direct download links
const getDirectImageUrl = (url: string) => {
  if (url.includes('drive.google.com')) {
    const match: any = url.match(/\/d\/(.+?)\/view/);
    // const fileId = match[1];
    //  const directLink = `https://drive.google.com/uc?export=download&id=${fileId}`
    return match ? `https://drive.google.com/uc?export=download&id=${match[1]}` : url;
  } else if (url.includes('dropbox.com')) {
    return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');
  } else {
    return url; // For other types of URLs like Cloudinary, direct URL works
  }
};

// Function to fetch the image, ensuring it's compatible with canvas
const fetchImageBuffer = async (url: string) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    let buffer = Buffer.from(response.data, 'binary');

    // Attempt to use the buffer directly, but convert if incompatible
    try {
      await loadImage(buffer); // Test if the format is compatible
    } catch (error) {
      // Convert image to PNG if unsupported
      buffer = await sharp(buffer).png().toBuffer();
    }

    return buffer;
  } catch (error: any) {
    throw new Error(`Failed to fetch and process image: ${error.message}`);
  }
};

export async function POST(req: NextRequest) {
  try {
    const { task, option1, imageUrl } = await req.json();

    // Convert to direct image URL if necessary
    const directImageUrl = getDirectImageUrl(imageUrl);

    // Fetch the image and get the buffer
    const imageBuffer = await fetchImageBuffer(directImageUrl);

    // Load the image from the buffer
    const image = await loadImage(imageBuffer);
    console.log("Image loaded successfully!");

    // Create the canvas
    const canvas = createCanvas(800, 1000); // Adjust height for text and image
    const ctx = canvas.getContext('2d');

    // Dark gradient background
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 100,
      canvas.width / 2, canvas.height / 2, 400
    );
    gradient.addColorStop(0, '#2a0c63');
    gradient.addColorStop(1, '#4e048d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw task text at the top
    ctx.fillStyle = '#ffffff';  // White text
    ctx.font = 'bold 40px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(task, canvas.width / 2, 100);

    // Draw option1 below the task
    ctx.fillStyle = '#34c759';  // Green text for option1
    ctx.font = '36px sans-serif';
    ctx.fillText(option1, canvas.width / 2, 200);

    // Draw the image
    const imageHeight = 600;  // Reserve space for the image
    const imageWidth = canvas.width - 100;  // Add some margin to the sides
    ctx.drawImage(image, 50, 300, imageWidth, imageHeight);  // Draw image below the text

    // Convert canvas to buffer
    const buffer = canvas.toBuffer('image/png');

    // Upload the image to Pinata
    const uploadedImageUrl = await uploadToPinata(buffer);

    // Respond with the Pinata URL of the generated image
    return NextResponse.json({ imageUrl: uploadedImageUrl });
  } catch (error) {
    console.error('Failed to process request:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to process request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
export const runtime = 'edge';