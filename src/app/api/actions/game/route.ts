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
  ActionPostResponse,
  Action
} from "@solana/actions";

// State to track game status and update the icon dynamically
let gameState = {
  isStarted: false,
  icon: "https://res.cloudinary.com/ducsu6916/image/upload/v1729534996/rjzl1f1c8yfko1stduvg.jpg", // Default icon
};

export async function GET(req: NextRequest) {
  // Update icon based on the game state
  const iconUrl = gameState.isStarted
    ? "https://res.cloudinary.com/ducsu6916/image/upload/v1729535378/d1ev6vgny11rczymbzr2.png" // New icon when game starts
    : gameState.icon;

  let response: ActionGetResponse = {
    icon: iconUrl, // Dynamically set icon based on state
    title: "Cards Against Humanity",
    description:
      "Start playing our very interesting and engaging game powered by Solana.",
    label: "Check out our fun game!",
    links: {
      actions: [
        {
          type: "transaction",
          label: "Start Game",
          href: "/api/actions/game?state=start", // Start the game
        },
      ],
    },
  };

  return NextResponse.json(response, {
    headers: ACTIONS_CORS_HEADERS,
  });
}

export const OPTIONS = GET;
export const runtime = 'edge';
export async function POST(req: NextRequest) {
  try {
    const { account } = await req.json();
    if (!account) {
      throw new Error("Account public key is required");
    }
    const response = await fetch("http://www.cardsagainsthumanity.fun/api/randomTask");
    const data: any = await response.json();
    const { task, options }: any = data;

    console.log(
      "here is the task ",
      await task,
      "and this is the options: ",
      await options
    );

    // Fetch random task from your API
    const resp = await fetch("http://www.cardsagainsthumanity.fun/api/banner/initial", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify that you're sending JSON data
      },
      body: JSON.stringify({
        question: task,
        option1: options[0],
        option2: options[1],
        option3: options[2],
      }),
    });
    const datam = await resp.json();

    console.log("Random task fetched: ", datam);

    // Convert the account string to a PublicKey object
    const sender = new PublicKey(account);
    console.log("Sender's public key:", sender);

    const connection = new Connection(
      process.env.SOLANA_RPC! || clusterApiUrl("devnet")
    );
    let amount = 0.01;
    let toPubkey = new PublicKey(
      "8SM1A6wNgreszhF8U7Fp8NHqmgT8euMZFfUvv5wCaYfL"
    );

    const minimumBalance = await connection.getMinimumBalanceForRentExemption(
      0
    );

    const transferSolInstruction = SystemProgram.transfer({
      fromPubkey: sender, // Corrected here
      toPubkey: toPubkey,
      lamports: amount * LAMPORTS_PER_SOL,
    });

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    const transaction = new Transaction({
      feePayer: sender, // Corrected here
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
        "perform the above task with one of the options and click a picture while doing the task...",
      /** button text rendered to the user */
      label: "string",
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
                options: [
                  { label: options[0], value: options[0] },
                  { label: options[1], value: options[1] },
                  { label: options[2], value: options[2] },
                ],
              },
              {
                type: "url",
                name: "imageUrl",
                label: "Image URL",
              },
            ],
          },
          {
            type: "transaction",
            label: "Restart Game",
            href: "/api/actions/game?state=restart", // Restart the game
          },
          {
            type: "transaction",
            label: "Mint NFT",
            href: "/api/actions/game?state=mint", // Mint NFT
          },
          {
            type: "transaction",
            label: "Vote for Task",
            href: "/api/actions/game?state=vote", // Vote for task
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
