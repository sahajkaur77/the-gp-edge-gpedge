import { GoogleGenAI } from "@google/genai";
import { gpEdgeSystemPrompt } from "./prompts/gpEdge";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Helper to retry a function with attempts and delay.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  attempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.warn(`Gemini API call failed (attempt ${i + 1}/${attempts}):`, error);
      if (i < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

/**
 * Generates a response using Google Gemini.
 * @param message The user message to respond to.
 */
export async function generateResponse(message: string): Promise<string> {
  const response = await withRetry(async () => {
    return await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: gpEdgeSystemPrompt,
      },
    });
  });

  return response.text || "";
}
