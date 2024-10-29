"use client";
import { useState } from 'react';

export default function Home() {
    const [question, setQuestion] = useState('');
    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');
    const [option3, setOption3] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const generateBanner = async () => {
        const response = await fetch('/api/banner', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question,
                option1,
                option2,
                option3
            })
        });
        const data = await response.json();
        if (data.imageUrl) {
            setImageUrl(data.imageUrl);  // Store the Cloudinary URL in the state
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Create Custom Banner</h1>
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Question"
                style={{ marginBottom: '10px', padding: '8px', width: '80%' }}
            />
            <br />
            <input
                type="text"
                value={option1}
                onChange={(e) => setOption1(e.target.value)}
                placeholder="Option 1"
                style={{ marginBottom: '10px', padding: '8px', width: '80%' }}
            />
            <br />
            <input
                type="text"
                value={option2}
                onChange={(e) => setOption2(e.target.value)}
                placeholder="Option 2"
                style={{ marginBottom: '10px', padding: '8px', width: '80%' }}
            />
            <br />
            <input
                type="text"
                value={option3}
                onChange={(e) => setOption3(e.target.value)}
                placeholder="Option 3"
                style={{ marginBottom: '10px', padding: '8px', width: '80%' }}
            />
            <br />
            <button onClick={generateBanner} style={{ padding: '10px 20px' }}>
                Generate Banner
            </button>
            <div style={{ marginTop: '20px' }}>
                {imageUrl && (
                    <div>
                        <img src={imageUrl} alt="Custom Banner" />
                        <br />
                        <a href={imageUrl} download="banner.png" style={{ padding: '10px 20px', textDecoration: 'none', background: '#0070f3', color: 'white' }}>
                            Download Banner
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
