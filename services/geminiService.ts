
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are KindHeart AI, the helpful assistant for the KindHeart Orphanage and Adoption Platform.
Your goal is to guide users through the adoption process, explain how to donate, and provide information about the children (respecting privacy).

Key Points:
- Be empathetic, professional, and warm.
- If users ask about adoption, explain that it's a journey of love and legal compliance.
- If users ask about donations, mention that they support food, education, and healthcare for children.
- You can help navigate to "Dashboard" (profiles), "Donations", or "Login".
- Never provide sensitive legal advice; always suggest contacting professional legal experts for final adoption steps.
- Do not mention that you are a language model.
`;

export async function getAIChatResponse(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return response.text || "I'm sorry, I couldn't process that request right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently offline. Please try again in a moment.";
  }
}

export async function findNearbyOrphanages(lat: number, lng: number) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find and list valid orphanages or children's homes near the coordinates: Latitude ${lat}, Longitude ${lng}. Please provide their names and locations.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng }
          }
        }
      },
    });
    
    // Return both the text response and any grounding sources if available
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Nearby search error:", error);
    throw error;
  }
}
