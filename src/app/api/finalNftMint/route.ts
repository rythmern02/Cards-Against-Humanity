// import type { NextApiRequest, NextApiResponse } from "next";
// import axios from "axios";
// import { NextResponse } from "next/server";


// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     // Parse the JSON body
//     const {
//       task,
//       description,
//       imageUrl,
//       externalUrl,
//       attributes,
//       properties,
//     } = req.body;

//     // Log the data to confirm parameters
//     console.log(
//       "Received data: ",
//       task,
//       description,
//       imageUrl,
//       externalUrl,
//       attributes,
//       properties
//     );

//     // Check for missing required fields
//     if (!task || !description || !imageUrl || !externalUrl) {
//       return res.status(400).json({
//         message: "Missing required parameters",
//       });
//     }

//     // Define metadata for Pinata
//     const metadata = {
//       name: task || "Cards Against Humanity",
//       image: imageUrl,
//       description: description || "This is an NFT on Solana",
//       external_url:
//         externalUrl || "https://localhost:3000/cards-against-humaniy",
//       attributes: attributes || [],
//       properties: properties || {
//         files: [
//           {
//             uri: imageUrl,
//             type: "image/png", // Ensure correct MIME type
//           },
//         ],
//         category: "image",
//       },
//     };

//     // Send metadata to Pinata
//     const response = await axios.post(PINATA_ENDPOINT, metadata, {
//       headers: {
//         "Content-Type": "application/json",
//         pinata_api_key: PINATA_API_KEY,
//         pinata_secret_api_key: PINATA_SECRET_API_KEY,
//       },
//     });

//     // Return success response
//     return res.status(200).json({
//       message: "Metadata uploaded successfully",
//       ipfsHash: response.data.IpfsHash,
//     });
//   } catch (error) {
//     console.error("Error uploading metadata:", error);
//     return res.status(500).json({ error: "Error uploading metadata" });
//   }
// }
