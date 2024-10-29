// Import required libraries
import { NextResponse } from "next/server";
import { create, mplCore } from "@metaplex-foundation/mpl-core";
import { generateSigner } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";

export async function POST(request: Request) {
  try {
    // Parse incoming data (image URL, metadata, etc.)
    const {
      account,
      cloudinaryImageUrl,
      name,
      description,
      externalUrl,
      attributes,
    } = await request.json();

    console.log("okay the process has startes")
    // ** Setting Up Umi with an Existing Wallet **
    const umi = createUmi("https://api.devnet.solana.com")
      .use(mplCore())
      // Register Wallet Adapter to Umi
      .use(walletAdapterIdentity(account));
    // .use(wallet(account))

    // Load keypair from `keypair.json`
    // const walletFile = fs.readFileSync(path.join('C:\\Users\\nagra\\blinks\\cards-against-humanity\\src\\app\\api\\nftMint\\keypair.json'), 'utf-8');
    // const secretKey = new Uint8Array(JSON.parse(walletFile.toString()));
    // const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);

    // Load the keypair into umi.

    console.log("Umi is set up with the existing wallet keypair.", umi);

    // ** Prepare Metadata for Arweave **
    const metadata = {
      name: name || "My NFT",
      description: description || "This is an NFT on Solana",
      image: cloudinaryImageUrl,
      external_url: externalUrl || "https://example.com",
      attributes: attributes || [],
      properties: {
        files: [
          {
            uri: cloudinaryImageUrl,
            type: "image/png", // Ensure correct MIME type
          },
        ],
        category: "image",
      },
    };

    // Upload metadata JSON to Arweave
    console.log("Uploading Metadata...");
    const metadataUri = await umi.uploader.uploadJson(metadata);

    // ** Creating the NFT **
    const asset = generateSigner(umi);
    console.log("Creating NFT...");
    const tx = await create(umi, {
      asset,
      name: metadata.name,
      uri: metadataUri,
    }).sendAndConfirm(umi);

    // Get the transaction signature
    const signature = base58.deserialize(tx.signature)[0];

    // Construct the NFT and transaction URLs
    const transactionUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
    const nftUrl = `https://core.metaplex.com/explorer/${account?.publicKey}?env=devnet`;

    console.log("NFT created successfully.");
    return NextResponse.json({
      message: `NFT Created Successfully and here is the signature for that : ${signature}`,
      transactionUrl,
      nftUrl,
    });
  } catch (error: any) {
    console.error("Error creating NFT:", error);
    return NextResponse.json({
      error: "Failed to create NFT",
      details: error.message,
    });
  }
}
