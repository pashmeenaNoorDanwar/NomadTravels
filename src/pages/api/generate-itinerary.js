// app/api/generate-itinerary.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return; // Important to return here to avoid further execution
    }

    // Extracting selectedLocation, startDate, endDate, budget, and activity from the POST body
    const { selectedLocation, startDate, endDate, budget, activity } = req.body;
    if (!selectedLocation || !startDate || !endDate) {
        res.status(400).json({ error: "Selected location, start date, and end date are required" });
        return; // Return to prevent further execution if any of the required fields are missing
    }

    // Setting up the AI model
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generating the itinerary based on the selected location, start date, end date, budget, and activity
    const itineraryPrompt = `Generate a travel itinerary for ${selectedLocation} from ${startDate} to ${endDate} with a budget of ${budget} USD for this trip and including activities like ${activity}. Include local events, restaurants, supermarkets, and some tourist attractions. Format the itinerary as follows:

        Day 1:
        - Activity 1
        - Activity 2
        - Restaurant: [Restaurant Name] if any
        - Supermarket: [Supermarket Name] if any
        - anything else
        
        Day 2:
        - similar format
        
        Day 3:
        - similar format
        
        Please strictly adhere to this format and do not include any additional text or explanations.`;
    
        
    try {
        const itineraryResult = await model.generateContent(itineraryPrompt);
        const itineraryText = await itineraryResult.response.text();
        
        // Send successful response back with the generated itinerary
        return res.status(200).json({ itinerary: itineraryText });
    } catch (error) {
        console.error('Error generating itinerary:', error);
        return res.status(500).json({ error: 'Failed to generate itinerary' });
    }
}