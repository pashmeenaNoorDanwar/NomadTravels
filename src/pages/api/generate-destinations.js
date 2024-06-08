// pages/api/generate-destinations.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      res.status(200).json({ text });
    } catch (error) {
      console.error("Error generating destinations:", error);
      res.status(500).json({ error: "Failed to generate destinations" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}