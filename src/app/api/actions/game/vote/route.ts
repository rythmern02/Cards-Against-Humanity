import { NextRequest, NextResponse } from "next/server";
import {
  Transaction,
  PublicKey,
  SystemProgram,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  CompletedAction,
  ActionPostResponse,
  ActionError,
  Action,
} from "@solana/actions";

// Import required libraries
import { create, mplCore } from "@metaplex-foundation/mpl-core";
import { createNoopSigner, generateSigner, publicKey, signerIdentity } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

// State to track game status and update the icon dynamically
let gameState = {
  isStarted: false,
  icon: "https://res.cloudinary.com/ducsu6916/image/upload/v1729534996/rjzl1f1c8yfko1stduvg.jpg", // Default icon
};

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Method not supported" } as ActionError, {
    status: 403,
  });
}

export const OPTIONS = POST;

export async function POST(req: NextRequest) {
  try {
    console.log("okay... Here we get started with the function....");

    let { searchParams } = req.nextUrl;
    let choice = searchParams.get("choice") || "";
    let account = searchParams.get("account") || "";
    let imageUrl = searchParams.get("imageUrl") || "";
    let task = searchParams.get("task") || "";
    const resp = await fetch("http://localhost:3000/api/banner/finalNft", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify that you're sending JSON data
      },
      body: JSON.stringify({
        question: task,
        option1: choice,
        imageUrl: imageUrl,
      }),
    });
    const datam = await resp.json();

    console.log("Random task fetched: ", datam);
    // console.log("here the damnn thing starts......")
    // const respo = await fetch("http://localhost:3000/api/mintNft", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json", // Specify that you're sending JSON data
    //   },
    //   body: JSON.stringify({
    //     account: account,
    //     cloudinaryImageUrl: imageUrl,
    //     name: task,
    //     description: "hello this is rn",
    //     externalUrl: "https://www.web3spell.fun",
    //     attributes: [
    //       {
    //         trait_type: "Background",
    //         value: "Sunset",
    //       },
    //       {
    //         trait_type: "Rarity",
    //         value: "Rare",
    //       },
    //     ],
    //   }),
    // });
    // const datamm = await respo.json();

    const description =
      "hello this is the description for the cards against humanity nft this means the person mints this got the proof that he has performed the task";

    const externalUrl = "https://www.web3spell.fun";

    const attributes = [
      {
        trait_type: "Background",
        value: "CArds against humanity task ",
      },
      {
        trait_type: "Rarity",
        value: "Rare",
      },
    ];

    console.log("here the damnn thing starts......");

    console.log(
      "here is the choice:",
      choice,
      "here is the account",
      searchParams
    );
    const sender = new PublicKey(account);

    const RPC_ENDPOINT = "https://api.devnet.solana.com";
    const signer = createNoopSigner(publicKey(sender));
    
    const umi = createUmi(RPC_ENDPOINT)
      .use(mplCore())
      // Register Wallet Adapter to Umi
      .use(signerIdentity(signer))
      .use(irysUploader())

    // console.log("Sender's public key:", sender);
    const metadata = {
      name: task || "My NFT",
      description: description || "This is an NFT on Solana",
      image: imageUrl,
      external_url: externalUrl || "https://",
      attributes: attributes || [],
      properties: {
        files: [
          {
            uri: imageUrl,
            type: "image/png", // Ensure correct MIME type
          },
        ],
        category: "image",
      },
    };
    
    console.log("Uploading Metadata...");
    const metadataUri = await umi.uploader.uploadJson(metadata);

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
    const nftUrl = `https://core.metaplex.com/explorer/${account}?env=devnet`;

    

    // Perform action based on the "state" param

    const connection = new Connection(
      process.env.SOLANA_RPC! || clusterApiUrl("devnet")
    );
    let amount = 0.0001;
    let toPubkey = new PublicKey(
      "8SM1A6wNgreszhF8U7Fp8NHqmgT8euMZFfUvv5wCaYfL"
    );
    // ensure the receiving account will be rent exempt

    // create an instruction to transfer native SOL from one wallet to another
    const transferSolInstruction = SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: toPubkey,
      lamports: amount * LAMPORTS_PER_SOL,
    });

    // get the latest blockhash amd block height
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    // create a legacy transaction
    const transaction = new Transaction({
      feePayer: sender,
      blockhash,
      lastValidBlockHeight,
    }).add(transferSolInstruction);

    const hello: Action = {
      type: "action",
      icon: datam.imageUrl,
      /** describes the source of the action request */
      title: task,
      /** brief summary of the action to be performed */
      description:
        "perform the above task with one of the options and click a picture while doing the task....",
      /** button text rendered to the user */
      label: "string",
      /** UI state for the button being rendered to the user */
      // disabled?: boolean;
      links: {
        /** list of related Actions a user could perform */
        actions: [
          {
            type: "post",
            href: `/api/actions/game/choose?choice={choice}&account=${account}&imageUrl={imageUrl}&task=${task}`,
            label: "Choose",
            parameters: [
              {
                type: "select",
                name: "choice",
                label: "Choose one option",
                required: true,
                options: [{ label: "hello", value: "wass up" }],
              },
              {
                type: "url",
                name: "imageUrl",
                label: "Image URL",
              },
            ],
          },
        ],
      },
    };
    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        type: "transaction",
        transaction: transaction,
        links: {
          next: {
            type: "inline",
            action: hello,
          },
        },
      },
    });

    return NextResponse.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.error("Error in POST /api/actions", err);

    let errorMessage = "An unknown error occurred";
    if (typeof err === "string") errorMessage = err;
    if (err instanceof Error) errorMessage = err.message;

    return new Response(errorMessage, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
}
