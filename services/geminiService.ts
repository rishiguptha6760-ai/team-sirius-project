
import { GoogleGenAI } from "@google/genai";
import { Event } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateEventDescription = async (title: string): Promise<string> => {
  if (!process.env.API_KEY) return "AI service is unavailable. Please set the API_KEY.";
  try {
    const prompt = `Generate a compelling, short event description for a college event titled "${title}". The description should be around 2-3 sentences, focusing on excitement and key activities. Do not use markdown.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text;
  } catch (error) {
    console.error("Error generating event description:", error);
    return "Failed to generate description. Please try again.";
  }
};

export const getAIResponse = async (question: string, events: Event[]): Promise<string> => {
    if (!process.env.API_KEY) return "AI service is unavailable. Please set the API_KEY.";
    try {
        const eventContext = events.map(event => 
            `Event: ${event.title}\nDate: ${event.date}\nVenue: ${event.venue}\nDescription: ${event.description}\nSchedule: ${event.schedule}\nRules: ${event.rules}\nContact: ${event.contact}`
        ).join('\n\n---\n\n');

        const prompt = `You are a helpful event assistant for a college festival named EventEase. Answer the user's question based *only* on the following event information. If the answer isn't in the information, say you don't have that specific detail. Be friendly and concise.

Event Information:
${eventContext}

User's Question: "${question}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.2
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error getting AI response:", error);
        return "Sorry, I encountered an error. Please try asking again.";
    }
};
