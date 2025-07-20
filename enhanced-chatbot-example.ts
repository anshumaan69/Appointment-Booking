import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ChatMessage {
  message: string;
  conversationHistory?: Array<{role: string, content: string}>;
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Basic FAQ for quick responses
const quickFAQs: Record<string, string> = {
  "book appointment": "To book an appointment, click on 'Book Appointment' in the navigation menu. You can select your preferred date, time, and service.",
  "appointment hours": "Our clinic hours are Monday to Friday 9:00 AM to 9:00 PM, and Saturday 9:00 AM to 5:00 PM. We're closed on Sundays and public holidays.",
  "emergency": "For medical emergencies, please call 911 or go to your nearest emergency room immediately. Our clinic handles non-emergency appointments and routine care.",
  "contact": "You can reach our office during business hours for appointments, questions, or concerns. After hours, please call for urgent matters or visit the emergency room for emergencies."
};

const MEDICAL_CONTEXT = `
You are a helpful medical assistant for an appointment booking system. Your role is to:

1. PROVIDE GENERAL HEALTH INFORMATION - You can share general health education and wellness tips
2. GUIDE TO APPROPRIATE CARE - Help users understand when to seek different types of medical care
3. APPOINTMENT ASSISTANCE - Help with booking, scheduling, and preparation for appointments
4. CLINIC INFORMATION - Provide information about services, hours, and procedures

IMPORTANT LIMITATIONS:
- NEVER provide specific medical diagnoses
- NEVER recommend specific medications or treatments
- NEVER replace professional medical advice
- ALWAYS recommend consulting with healthcare providers for medical concerns
- For urgent symptoms, direct to emergency services

ALWAYS include appropriate disclaimers about seeking professional medical advice.

Clinic Services Available:
- General consultations
- Health check-ups  
- Preventive care
- Chronic disease management
- Vaccinations
- Minor procedures
- Specialist referrals

If asked about serious symptoms or conditions, guide them to book an appointment or seek immediate care if urgent.
`;

function isQuickFAQ(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  for (const [key, response] of Object.entries(quickFAQs)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  return null;
}

async function getAIResponse(userMessage: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `${MEDICAL_CONTEXT}

User Question: ${userMessage}

Please provide a helpful response following the guidelines above. Keep responses concise but informative.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body: ChatMessage = await request.json();
    const userMessage = body.message;
    
    if (!userMessage || userMessage.trim() === "") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Check for quick FAQ responses first
    const quickResponse = isQuickFAQ(userMessage);
    if (quickResponse) {
      return NextResponse.json({
        success: true,
        response: quickResponse,
        source: "faq"
      });
    }

    // For complex queries, use Gemini AI
    const aiResponse = await getAIResponse(userMessage);
    
    return NextResponse.json({
      success: true,
      response: aiResponse,
      source: "ai"
    });
    
  } catch (error) {
    console.error("Chatbot API error:", error);
    
    // Fallback response for complex medical queries
    const fallbackResponse = `I understand you have a medical question. While I can provide general health information, I recommend scheduling an appointment with one of our healthcare providers for personalized medical advice. 

For urgent concerns, please call our office directly or seek immediate medical attention if it's an emergency.

Would you like help booking an appointment?`;
    
    return NextResponse.json(
      { 
        success: true,
        response: fallbackResponse,
        source: "fallback"
      },
      { status: 200 }
    );
  }
}
