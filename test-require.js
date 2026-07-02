require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

console.log("Key:", process.env.GEMINI_API_KEY ? "Loaded" : "Missing");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hello, what is your purpose?",
      config: {
        systemInstruction: "You are GP Edge AI Assistant.",
      }
    });
    console.log("Success:", response.text);
  } catch (err) {
    console.error("Failed:", err.message || err);
  }
}
main();
