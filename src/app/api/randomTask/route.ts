import { NextResponse } from "next/server";
import { tasks, options } from "@/app/db/tasks";

// Utility function to shuffle an array
const shuffleArray = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

// Utility function to get a random element from an array
const getRandomElement = (array: string[]) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

// Handler for the API route
export async function GET() {
  // Shuffle tasks and options to ensure randomness
  shuffleArray(tasks);
  shuffleArray(options);

  // Select one random task
  const randomTask = getRandomElement(tasks);

  // Select three unique random options
  const randomOptions: any = [];
  while (randomOptions.length < 3) {
    const randomOption = getRandomElement(options);
    if (!randomOptions.includes(randomOption)) {
      randomOptions.push(randomOption);
    }
  }

  // Construct the response object
  const result = {
    task: randomTask,
    options: randomOptions,
  };

  // Send the response as JSON with the "Cache-Control" header
  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate", // Disable browser caching
    },
  });
}