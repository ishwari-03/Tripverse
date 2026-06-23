import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// List of models to try in sequence if others fail
const MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro",
  "gemini-pro",
  "gemini-1.0-pro"
];

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export async function callGemini(prompt) {
  let lastError = null;

  for (const modelId of MODEL_CANDIDATES) {
    try {
      console.log(`📡 Attempting Gemini with model: ${modelId}...`);
      
      const model = genAI.getGenerativeModel({ model: modelId });
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(prompt);
      
      if (result?.response) {
        console.log(`✅ Success with model: ${modelId}`);
        return result.response.text();
      }
    } catch (err) {
      lastError = err;
      const msg = (err.message || "").toLowerCase();
      console.warn(`⚠️ Model ${modelId} failed:`, err.message || err);

      // Treat client/auth/model-not-found errors as fatal (don't try other models).
      // For transient/server errors (5xx, rate limits, high demand) continue to next model.
      const fatalIndicators = ["404", "not found", "401", "403", "invalid", "permission", "not authorized", "access denied", "invalid api key", "invalid key"];
      const isFatal = fatalIndicators.some(ind => msg.includes(ind));
      if (isFatal) {
        break;
      }

      // Transient error: wait a bit and try next model in the list
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));
      } catch (e) {
        // ignore
      }
      continue;
    }
  }

  console.error("❌ All AI models failed.");
  throw lastError || new Error("All AI models failed to respond");
}
