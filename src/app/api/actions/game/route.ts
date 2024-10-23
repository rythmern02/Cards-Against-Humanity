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
  Action,
} from "@solana/actions";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

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
    type: "action",
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
        {
          type: "transaction",
          label: "Stop Game",
          href: "/api/actions/game?state=stop", // Stop the game
        },
        {
          type: "transaction",
          label: "Restart Game",
          href: "/api/actions/game?state=restart", // Restart the game
        },
        {
          type: "transaction",
          label: "Choose Option",
          href: "/api/actions/game?state=choose&choice={choice}",
          parameters: [
            {
              type: "select",
              name: "choice",
              label: "Choose one option",
              required: true,
              options: [
                { label: "Option 1", value: "1" },
                { label: "Option 2", value: "2" },
                { label: "Option 3", value: "3" },
              ],
            },
          ],
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

  return NextResponse.json(response, {
    headers: ACTIONS_CORS_HEADERS,
  });
}

export const OPTIONS = GET;

export async function POST(req: NextRequest) {
  try {
    const { account } = await req.json();
    if (!account) {
      throw new Error("Account public key is required");
    }

    let { searchParams } = req.nextUrl;
    let actionState = searchParams.get("state") || "";

    const sender = new PublicKey(account);
    console.log("Sender's public key:", sender);

    // Perform action based on the "state" param
    let message = "";
    let response: Action = {
      icon: gameState.icon,
      label: `Game Action`,
      title: `Action Taken`,
      description: `An action was performed in the game.`,
      type: "action",
      links: { actions: [] },
    };

    switch (actionState) {
      case "start":
        message = "Game started!";
        gameState.isStarted = true;
        response.title = "Game Started!";
        response.description = "You have started the game.";
        console.log("Game started.");
        break;

      case "stop":
        message = "Game stopped!";
        gameState.isStarted = false;
        response.title = "Game Stopped!";
        response.description = "You have stopped the game.";
        console.log("Game stopped.");
        break;

      case "restart":
        message = "Game restarted!";
        gameState.isStarted = true;
        response.title = "Game Restarted!";
        response.description = "The game has been restarted.";
        console.log("Game restarted.");
        break;

      case "choose":
        const choice = searchParams.get("choice");
        if (!choice) throw new Error("Choice parameter is missing");
        message = `You selected option ${choice}.`;
        response.title = `Option ${choice} Selected`;
        response.description = `You chose option ${choice}. Perform the corresponding task.`;
        break;

      case "mint":
        // Example mint NFT logic would be here
        message = "NFT minted!";
        response.title = "NFT Minted!";
        response.description = "You have successfully minted an NFT.";
        break;

      case "vote":
        // Example voting logic would be here
        message = "Vote submitted!";
        response.title = "Vote Submitted!";
        response.description = "Your vote has been submitted.";
        break;

      default:
        throw new Error("Invalid action parameter");
    }

    return NextResponse.json(response, {
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
