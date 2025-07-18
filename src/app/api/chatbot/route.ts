import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("Chatbot API called");
    
    const { message } = await req.json();
    console.log("Received message:", message);
    
    if (!message) {
      console.log("No message provided");
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log("API key exists:", !!apiKey);
    
    if (!apiKey) {
      console.log("API key missing - using fallback response");
      // Fallback response when API key is missing
      return NextResponse.json({ 
        reply: "I'm a simple chatbot. API key not configured for advanced AI features. How can I help you with your appointment booking?" 
      });
    }

    console.log("Initializing Gemini AI...");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("Generating content...");
    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();
    
    console.log("Response generated successfully");
    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Detailed chatbot error:", error);
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error");
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    
    // Fallback response on error
    return NextResponse.json({ 
      reply: "Sorry, I'm having technical difficulties. Please try again later or contact support for help with your appointment booking."
    });
  }
}
