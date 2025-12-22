import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function callGemini(prompt) {
  try {
    const result = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    console.log("FULL AI RAW RESPONSE:", result);

    
    const aiText =
      result.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    console.log("AI Extracted Text:", aiText);

    return aiText;

  } catch (err) {
    console.error("❌ Gemini Error:", err);
    throw err;
  }
}
