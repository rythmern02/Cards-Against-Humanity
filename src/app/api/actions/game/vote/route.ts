import { NextRequest, NextResponse } from "next/server";
import {
  ACTIONS_CORS_HEADERS,
  CompletedAction,
  ActionError
} from "@solana/actions";

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

    console.log("here the damnn thing starts......");

    const response: CompletedAction = {
      type: "completed",
      icon: "https://res.cloudinary.com/ducsu6916/image/upload/v1729534996/rjzl1f1c8yfko1stduvg.jpg",
      title: "Voila!  ",
      description: "Great you have Successfully minted the Nft of that task you 've performed!",
      label: "this is RN"
    };

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
