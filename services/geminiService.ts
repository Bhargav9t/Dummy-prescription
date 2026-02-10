
import { GoogleGenAI, Type } from "@google/genai";
import { Prescription, GenerationConfig } from "../types";

export const generateSyntheticPrescriptions = async (config: GenerationConfig): Promise<Prescription[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate ${config.count} unique, synthetic medical prescriptions. 
    IMPORTANT: For each prescription, choose a completely RANDOM medical condition or disease from the entire world's medical knowledge (e.g., infectious diseases, oncology, neurology, rare genetic disorders, trauma, common cold, etc.). 
    Each prescription in the batch MUST be for a different disease. 
    Follow strict medical logic for the chosen condition. 
    Use Latin abbreviations like OD, BD, TDS, HS where appropriate for tablets. 
    Use clinically accurate dosages and routes (IV, IM, Oral, Top etc.).
    Prescriber must be "Dr. Rajesh Shah".
    Hospital must be "Hope Global Hospital".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            hospital_name: { type: Type.STRING },
            patient: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "Random ID like PX001, PX002" },
                name: { type: Type.STRING },
                age: { type: Type.NUMBER },
                gender: { type: Type.STRING }
              },
              required: ["id", "name", "age", "gender"]
            },
            diagnosis: { type: Type.STRING },
            medications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: "Inj, Tab, Syr, Cap, Oint etc." },
                  name: { type: Type.STRING },
                  dosage: { type: Type.STRING },
                  route: { type: Type.STRING },
                  frequency: { type: Type.STRING }
                },
                required: ["type", "name", "dosage", "route", "frequency"]
              }
            },
            advice: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            prescriber: { type: Type.STRING }
          },
          required: ["hospital_name", "patient", "diagnosis", "medications", "advice", "prescriber"]
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '[]');
    return data.map((p: any) => ({
      ...p,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Invalid data format received from generator.");
  }
};
