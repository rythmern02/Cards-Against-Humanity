import { NextResponse } from 'next/server';
import { ImageResponse } from '@vercel/og';
import axios from 'axios';
import FormData from 'form-data';

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;
const PINATA_FILE_ENDPOINT = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

// Function to upload image to Pinata
// Function to upload image to Pinata
const uploadToPinata = async (buffer) => {
  const formData = new FormData();
  formData.append('file', Buffer.from(buffer), 'image.png');

  const response = await axios.post(PINATA_FILE_ENDPOINT, formData, {
    headers: {
      ...formData.getHeaders(),
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
            backgroundColor: '#1a0836',
            backgroundImage: 'radial-gradient(circle at 50% 50%, #2a0c63, #1a0836)',
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <div
            style={{
              color: '#ffffff',
              fontSize: 48,
              fontWeight: 'bold',
              marginBottom: '30px',
              textAlign: 'center',
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '15px 30px',
              borderRadius: '15px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.8), 0 0 20px rgba(50, 50, 50, 0.5), inset 0 0 10px rgba(30, 30, 30, 0.4)',
              border: '2px solid rgba(60, 60, 60, 0.5)'              
            }}
          >
            Yaaay!!! Task Accomplished
          </div>
          <div
            style={{
              color: '#ffffff',
              fontSize: 36,
              marginBottom: '20px',
              textAlign: 'center',
              background: 'rgba(78, 4, 141, 0.6)',
              padding: '15px',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              maxWidth: '90%',
            }}
          >
            {task}
          </div>
          <div
            style={{
              color: '#34c759',
              fontSize: 32,
              marginBottom: '30px',
              textAlign: 'center',
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '10px 20px',
              borderRadius: '8px',
              border: '2px solid #34c759',
              boxShadow: '0 0 15px rgba(52, 199, 89, 0.5)',
            }}
          >
            {option1}
          </div>
          <div
            style={{
              position: 'relative',
              bottom: 0,
              left: 0,
              right: 0,
              width: '700px',
              height: '600px',
              borderRadius: '15px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.6), 0 0 30px rgba(78, 4, 141, 0.5)',
            }}
          >
            <img
              src={directImageUrl}
              alt="Proof of task completion"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, transparent, rgba(26, 8, 54, 0.8))',
                padding: '20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  color: '#ffffff',
                  fontSize: 24,
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                }}
              >
                NFT Proof of Cards Against Humanity Task
              </div>
              <div
                style={{
                  color: '#ffd700',
                  fontSize: 18,
                  marginTop: '5px',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                }}
              >
                cardsagainsthumanity.fun
              </div>
            </div>
          </div>
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
    return NextResponse.json({ uploadedImageUrl });
  } catch (error) {
    console.error('Failed to process request:', error);
    return new NextResponse('Failed to process request', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
