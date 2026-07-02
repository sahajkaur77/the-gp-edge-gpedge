import dotenv from "dotenv";
dotenv.config();

// Important: import openai AFTER dotenv.config()
import { generateResponse } from "./lib/openai";

async function main() {
  try {
    const response = await generateResponse("Hello, what is your purpose?");
    console.log("Success:", response);
  } catch (error) {
    console.error("Failed:", error);
  }
}

main();
