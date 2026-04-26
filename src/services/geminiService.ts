import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const generateDesignImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Generate a professional fashion design concept for: ${prompt}. Focus on textile patterns, garment structure, and modern aesthetic.`,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

export const generateDesignDescription = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a detailed technical description and production notes for a fashion design based on this prompt: "${prompt}". Include fabric suggestions, construction details, and target audience.`,
    });

    return response.text || null;
  } catch (error) {
    console.error("Error generating description:", error);
    return null;
  }
};
