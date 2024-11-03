import { NextResponse } from "next/server";
import { tasks, options } from "@/app/db/tasks";

// Utility function to shuffle an array
const shuffleArray = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

// Handler for the API route
export async function GET() {
  // Shuffle tasks and options to ensure randomness
  shuffleArray(tasks);
  shuffleArray(options);

  // Select one random task
  const randomTask = tasks[0];

  // Select three unique random options
  const randomOptions = options.slice(0, 3);

  // Construct the response object
  const result = {
    task: randomTask,
    options: randomOptions,
  };

  // Send the response as JSON
  return NextResponse.json(result);
}
