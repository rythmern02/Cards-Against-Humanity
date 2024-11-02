import { NextRequest, NextResponse } from "next/server";
import {
  createActionHeaders,
  NextActionPostRequest,
  CompletedAction,
  ActionError,
} from "@solana/actions";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

// Set up headers, including CORS
const headers = createActionHeaders();

// Handle unsupported GET requests
export const GET = async () => {
  return NextResponse.json({ message: "Method not supported" } as ActionError, {
    status: 403,
    headers,
  });
};

// Handle OPTIONS request for CORS
export const OPTIONS = async () => NextResponse.json(null, { headers });

export const POST = async (req: NextRequest) => {
  try {
    const { searchParams } = req.nextUrl;
    const choice = searchParams.get("choice") || "";
    const account = searchParams.get("account") || "";

    // Parse the incoming request body
    const body: NextActionPostRequest = await req.json();

    // Validate account input
    let accountPubKey: PublicKey;
    try {
      accountPubKey = new PublicKey(body.account);
    } catch {
      throw 'Invalid "account" provided';
    }

    // Validate the signature
    let signature: any;
    try {
      signature = body.signature;
      if (!signature) throw "Invalid signature";
    } catch {
      throw 'Invalid "signature" provided';
    }

    // Set up Solana connection
    const connection = new Connection(
      process.env.SOLANA_RPC || clusterApiUrl("devnet")
    );

    // Confirm the transaction status
    let status = await connection.getSignatureStatus(signature);
    if (!status || !status.value) throw "Unknown signature status";

    const confirmationStatus = status.value.confirmationStatus;
    if (
      confirmationStatus !== "confirmed" &&
      confirmationStatus !== "finalized"
    ) {
      throw "Unable to confirm the transaction";
    }

    // Retrieve the transaction for verification
    const transaction = await connection.getParsedTransaction(
      signature,
      "confirmed"
    );

    if (!transaction) {
      throw "Transaction not found";
    }

    // Construct the successful response payload
    const payload: CompletedAction = {
      type: "completed",
      title: "Voila!",
      icon: "https://res.cloudinary.com/ducsu6916/image/upload/v1729534996/rjzl1f1c8yfko1stduvg.jpg",
      label: "this is RN",
      description:
        `Great! You've successfully minted the NFT for the task you performed! ` +
        `Transaction signature: ${signature}`,
    };

    return NextResponse.json(payload, {
      headers,
    });
  } catch (err) {
    console.error("Error in POST /api/actions:", err);

    let actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof err === "string") actionError.message = err;
    else if (err instanceof Error) actionError.message = err.message;

    return NextResponse.json(actionError, {
      status: 400,
      headers,
    });
  }
};
