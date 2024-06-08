// pages/api/generate-destinations.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from 'openai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateDestinationImage = async (location) => {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "A travel destination in " + location,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    return response.data[0].url;
  } catch (error) {
    console.error("Error generating destination image:", error);
    return "/img/default.jpeg";
  }
};

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

      const destinations = [];
      const entries = text?.split("\n\n").slice(1);

      for (const entry of entries) {
        const [locationWithNumber, description] = entry.split("-");
        const [, location] = locationWithNumber.split(".");

        const imageUrl = await generateDestinationImage(location);

        destinations.push({
          location: location?.replaceAll("**", ""),
          description: description.replaceAll("**", ""),
          image: imageUrl,
        });
      }

      res.status(200).json({ destinations });
    } catch (error) {
      console.error("Error generating destinations:", error);
      res.status(500).json({ error: "Failed to generate destinations" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}