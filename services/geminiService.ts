
import { GoogleGenAI } from "@google/genai";

export const generateJobDescription = async (title: string, category: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a professional and engaging internship job description for a "${title}" role in the "${category}" category. 
                 Keep it concise (about 150 words). Include sections for Responsibilities and Requirements. 
                 Use a friendly and encouraging tone for students.`,
      config: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    });

    return response.text || "Failed to generate description. Please try writing manually.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating description. Please try again.";
  }
};
