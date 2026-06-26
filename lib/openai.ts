import { gpEdgeSystemPrompt } from "./prompts/gpEdge";

/**
 * Generates a response using OpenAI. Currently returns a mock response.
 * @param message The user message to respond to.
 */
export async function generateResponse(message: string): Promise<string> {
  // TODO: Replace with real OpenAI API call once the API key is configured.
  // Example implementation:
  // const response = await openai.chat.completions.create({
  //   model: "gpt-4o",
  //   messages: [
  //     { role: "system", content: gpEdgeSystemPrompt },
  //     { role: "user", content: message }
  //   ]
  // });
  // return response.choices[0].message.content || "";

  // Temporary mock response
  return `[Mock GP Edge AI Response] You asked: "${message}". (The actual OpenAI API call will be configured here later.)`;
}
