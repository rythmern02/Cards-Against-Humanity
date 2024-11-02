// app/api/task/route.ts

import { NextResponse } from "next/server";
import { tasks, options } from "@/app/db/tasks"; // Import tasks and options from the data file

// Utility function to select a random item from an array
const getRandomItem = (array: string[]) => {
  return array[Math.floor(Math.random() * array.length)];
};
export const runtime = 'edge';
// Handler for the API route
export async function GET() {
  // Select one random task
  const randomTask = getRandomItem(tasks);

  // Select three unique random options
  const randomOptions = new Set<string>();
  while (randomOptions.size < 3) {
    randomOptions.add(getRandomItem(options));
  }

  // Construct the response object
  const result = {
    task: randomTask,
    options: Array.from(randomOptions),
  };

  // Send the response as JSON
  return NextResponse.json(result);
}
