import { NextRequest, NextResponse } from "next/server";
import {
  createActionHeaders,
  CompletedAction,
  ActionError,
} from "@solana/actions";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  VersionedMessage,
  VersionedTransaction,
  TransactionMessage,
} from "@solana/web3.js";
import {
  createUmi,
  generateSigner,
  signerIdentity,
  publicKey,
  createNoopSigner,
} from "@metaplex-foundation/umi";
import { toWeb3JsKeypair } from "@metaplex-foundation/umi-web3js-adapters";

// Set up headers, including CORS
const headers = createActionHeaders();

export const GET = async () => {
  return NextResponse.json({ message: "Method not supported" } as ActionError, {
    status: 403,
    headers,
  });
};

export const OPTIONS = async () => NextResponse.json(null, { headers });

export const POST = async (req: NextRequest) => {
  try {
    const { searchParams } = req.nextUrl;
    const account = searchParams.get("account") || "";  // User's public key

    // Set up connection and endpoints
    const RPC_ENDPOINT = "https://api.devnet.solana.com";
    const connection = new Connection(RPC_ENDPOINT);

    // Set up sender and signer
    const sender = new PublicKey(account);
    const signer = createNoopSigner(publicKey(sender));

    const umi = createUmi()
      .use(signerIdentity(signer));

    // Destination wallet
    const destinationPublicKey = new PublicKey("8SM1A6wNgreszhF8U7Fp8NHqmgT8euMZFfUvv5wCaYfL");

    // Get recent blockhash for the transaction
    const { blockhash } = await connection.getLatestBlockhash();

    // Create a transfer transaction
    const transferTransaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: destinationPublicKey,
        lamports: 0.0001 * 1e9,  // 0.0001 SOL in lamports
      })
    );

    // Create a Versioned Message
    const message = new TransactionMessage({
      payerKey: sender,
      recentBlockhash: blockhash,
      instructions: transferTransaction.instructions,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(message);

    // Convert the signer keypair to a Web3.js Keypair and sign the transaction
    const senderKeypair = toWeb3JsKeypair(generateSigner(umi));
    transaction.sign([senderKeypair]);

    // Send and confirm the transaction
    const signature = await connection.sendTransaction(transaction);

    // Construct the successful response payload
    const payload: CompletedAction = {
      type: "completed",
      title: "Transaction Successful",
      icon: "https://res.cloudinary.com/ducsu6916/image/upload/v1729534996/rjzl1f1c8yfko1stduvg.jpg",
      label: "Transaction Complete",
      description: `Successfully transferred 0.0001 SOL to ${destinationPublicKey.toString()}. Transaction signature: ${signature}`,
    };

    return NextResponse.json(payload, { headers });
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
