import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import {
  PublicKey,
  Connection,
  clusterApiUrl,
  VersionedMessage,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionPostResponse,
  ActionError,
  Action,
} from "@solana/actions";

// Import required libraries
import { mplCore } from "@metaplex-foundation/mpl-core";
import {
  createNoopSigner,
  generateSigner,
  Instruction,
  percentAmount,
  publicKey,
  signerIdentity,
  TransactionBuilder,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { toWeb3JsInstruction, toWeb3JsKeypair } from "@metaplex-foundation/umi-web3js-adapters";

// State to track game status and update the icon dynamically
let gameState = {
  isStarted: false,
  icon: "https://res.cloudinary.com/ducsu6916/image/upload/v1729534996/rjzl1f1c8yfko1stduvg.jpg", // Default icon
};

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY!;
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY!;
const PINATA_ENDPOINT = "https://api.pinata.cloud/pinning/pinJSONToIPFS";


export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Method not supported" } as ActionError, {
    status: 403,
  });
}

export const OPTIONS = POST;
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    console.log("okay... Here we get started with the function....");
    let { searchParams } = req.nextUrl;
    let choice = searchParams.get("choice") || "";
    let account = searchParams.get("account") || "";
    let imageUrl = searchParams.get("imageUrl") || "";
    let task = searchParams.get("task") || "";
    console.log("here is the imageUrl: ", imageUrl)
    const resp = await fetch("http://www.cardsagainsthumanity.fun/api/banner/finalNft", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify that you're sending JSON data
      },
      body: JSON.stringify({
        task: task,
        option1: choice,
        imageUrl: imageUrl,
      }),
    });
    const datam = await resp.json();

    console.log("Random task fetched: ", datam);

    const description =
      "hello this is the description for the cards against humanity nft this means the person mints this got the proof that he has performed the task";

    const externalUrl = "https://www.cardsagainsthumanity.fun";

    const attributes = [
      {
        trait_type: "chosen_task",
        value: choice,
      },
      {
        trait_type: "Rarity",
        value: "Rare",
      },
    ];

    console.log("here the damnn thing starts......");

    const sender = new PublicKey(account);

    const RPC_ENDPOINT = "https://api.devnet.solana.com";
    const signer = createNoopSigner(publicKey(sender));

    const umi = createUmi(RPC_ENDPOINT)
      .use(mplCore())
      // Register Wallet Adapter to Umi
      .use(signerIdentity(signer))
      .use(mplTokenMetadata());
    
    console.log("Uploading Metadata...");

  // Define metadata for Pinata
  const metadata = {
    name: task || "Cards Against Humanity",
    image: datam.imageUrl,
    description: description || "This is an NFT on Solana",
    external_url:
      externalUrl || "https://www.cardsagainsthumanity.fun",
    attributes: attributes || [],
    properties:  {
      files: [
        {
          uri: imageUrl,
          type: "image/png", // Ensure correct MIME type
        },
      ],
      category: "image",
    },
  };

  // Send metadata to Pinata
  const response = await axios.post(PINATA_ENDPOINT, metadata, {
    headers: {
      "Content-Type": "application/json",
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  });

    // const metadataUri = await umi.uploader.uploadJson(metadata);
    const metadataUri =
      `https://ipfs.io/ipfs/${response.data.IpfsHash}`;
    console.log("here is the metadataUri", metadata);

    const mint = generateSigner(umi);

    console.log("Creating NFT...");
    const connection = new Connection(
      process.env.SOLANA_RPC! || clusterApiUrl("devnet")
    );
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    const createNftTransaction: TransactionBuilder = createNft(umi, {
      mint,
      name: `Cards Against Humanity Task`,
      symbol: "CAH",
      sellerFeeBasisPoints: percentAmount(0),
      uri: metadataUri,
    });
    createNftTransaction.setBlockhash(blockhash);
    const mintNftIx: Instruction[] = createNftTransaction.getInstructions()
    // conver Intruction[] to TransactionInstruction[]
    const web3JsIx: TransactionInstruction[] = mintNftIx.map(ix => toWeb3JsInstruction(ix))

    // Create a Versioned Transaction:

    // First create a v0 message
    const v0message: VersionedMessage = new TransactionMessage({
        payerKey: sender,
        recentBlockhash: blockhash,
        instructions: web3JsIx
    }).compileToV0Message()
    // Make a versioned Transaction
    const transactionv0 = new VersionedTransaction(v0message)

    // Convert umi keypair to web3.js keypair
    const mintKeypair = toWeb3JsKeypair(mint)
    transactionv0.sign([mintKeypair])
  

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
            href: `/api/actions/game/vote?choice={choice}&account=${account}`,
            label: "Choose",
            parameters: [
              {
                type: "select",
                name: "choice",
                label: "Choose one option",
                required: true,
                options: [{ label: "1 star", value:"1" },
                  { label: "2 star", value:"2" },
                  { label: "3 star", value:"3" },
                  { label: "4 star", value:"4" },
                  { label: "5 star", value:"5" }
                ],
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
        transaction: transactionv0,
        message: "Successfully minted the nft",
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
