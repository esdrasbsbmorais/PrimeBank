import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from 'node-fetch';
import dotenv from "dotenv";

dotenv.config();
global.fetch = fetch;

// Configure the API key
const genAI = new GoogleGenerativeAI(process.env.G00GLE_API_KEY);

// Function to generate text
export async function generateText(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error(error);
        throw error;
    }
}