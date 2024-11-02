import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from '@vercel/og';
import axios from 'axios';
import FormData from 'form-data';

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;
const PINATA_FILE_ENDPOINT = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

export const config = {
  runtime: 'edge',
};

// Function to upload image to Pinata
const uploadToPinata = async (buffer) => {
  const formData = new FormData();
  formData.append('file', new Blob([buffer]), 'image.png');

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
const getDirectImageUrl = (url) => {
  if (url.includes('drive.google.com')) {
    const match = url.match(/\/d\/(.+?)\/view/);
    return match ? `https://drive.google.com/uc?export=download&id=${match[1]}` : url;
  } else if (url.includes('dropbox.com')) {
    return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');
  } else {
    return url;
  }
};

export async function POST(req) {
  try {
    const { task, option1, imageUrl } = await req.json();

    // Convert to direct image URL if necessary
    const directImageUrl = getDirectImageUrl(imageUrl);

    const img = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: '#4e048d',
            backgroundImage: 'radial-gradient(circle at 50% 50%, #2a0c63, #4e048d)',
            padding: '20px',
          }}
        >
          <div style={{ color: 'white', fontSize: 40, fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
            {task}
          </div>
          <div style={{ color: '#34c759', fontSize: 36, marginBottom: '20px', textAlign: 'center' }}>
            {option1}
          </div>
          <img
            src={directImageUrl}
            alt="User provided image"
            style={{
              width: '700px',
              height: '600px',
              objectFit: 'contain',
            }}
          />
        </div>
      ),
      {
        width: 800,
        height: 1000,
      }
    );

    const buffer = await img.arrayBuffer();

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