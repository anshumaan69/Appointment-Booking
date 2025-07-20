import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ChatMessage {
  message: string;
  conversationHistory?: Array<{role: string, content: string}>;
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Quick FAQ responses for common appointment-related questions
const quickFAQs: Record<string, string> = {
  "book appointment": "To book an appointment, click on 'Book Appointment' in the navigation menu. You can select your preferred date, time, and service. Our available services include consultations, check-ups, and specialized treatments.",
  "appointment hours": "Our clinic hours are Monday to Friday 9:00 AM to 9:00 PM, and Saturday 9:00 AM to 5:00 PM. We're closed on Sundays and public holidays.",
  "cancel appointment": "You can cancel your appointment up to 24 hours before your scheduled time. Please contact us as soon as possible if you need to cancel or reschedule.",
  "reschedule": "To reschedule your appointment, please cancel your current booking and create a new one with your preferred time slot. You can also call our office for assistance.",
  "emergency": "For medical emergencies, please call 911 or go to your nearest emergency room immediately. Our clinic handles non-emergency appointments and routine care.",
  "contact": "You can reach our office during business hours for appointments, questions, or concerns. After hours, please call for urgent matters or visit the emergency room for emergencies.",
  "insurance": "We accept most major insurance plans. Please contact our office to verify if your specific insurance is accepted. We also offer self-pay options.",
  "payment": "We accept cash, credit cards, debit cards, and most insurance plans. Payment is due at the time of service unless prior arrangements have been made."
};

const MEDICAL_CONTEXT = `
You are a helpful medical assistant for an appointment booking system at a healthcare clinic. Your role is to:

1. PROVIDE GENERAL HEALTH INFORMATION - Share general health education, wellness tips, and preventive care guidance
2. GUIDE TO APPROPRIATE CARE - Help users understand when to seek different types of medical care (emergency, urgent, routine)
3. APPOINTMENT ASSISTANCE - Help with booking, scheduling, preparation for appointments, and understanding clinic services
4. CLINIC INFORMATION - Provide information about our services, hours, procedures, and policies

CLINIC SERVICES AVAILABLE:
- General consultations and physical exams
- Health check-ups and wellness visits
- Preventive care and screenings
- Chronic disease management
- Vaccinations and immunizations
- Minor procedures
- Specialist referrals
- Telemedicine appointments

IMPORTANT MEDICAL GUIDELINES:
- NEVER provide specific medical diagnoses
- NEVER recommend specific medications, dosages, or treatments
- NEVER replace professional medical advice
- ALWAYS recommend consulting with healthcare providers for specific medical concerns
- For urgent symptoms, direct to emergency services or immediate medical care
- Include appropriate medical disclaimers when discussing health topics

EMERGENCY SYMPTOMS (direct to 911/ER immediately):
- Chest pain, difficulty breathing, severe allergic reactions
- Signs of stroke (face drooping, arm weakness, speech difficulty)
- Severe injuries, uncontrolled bleeding
- Loss of consciousness, severe confusion
- Severe abdominal pain, persistent vomiting

URGENT SYMPTOMS (same-day care needed):
- High fever, persistent pain
- Minor injuries requiring evaluation
- Sudden onset of concerning symptoms

Keep responses helpful, empathetic, and professionally appropriate. Always prioritize patient safety.
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
    // Using Gemini Flash 1.5 - optimized for fast, efficient responses
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `${MEDICAL_CONTEXT}

User Question: ${userMessage}

Please provide a helpful, accurate response following the medical guidelines above. Keep responses concise but informative (2-3 paragraphs max). Include appropriate medical disclaimers when discussing health topics.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Gemini Flash API Error:', error);
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

    // Check for quick FAQ responses first (for common appointment questions)
    const quickResponse = isQuickFAQ(userMessage);
    if (quickResponse) {
      return NextResponse.json({
        success: true,
        response: quickResponse,
        source: "faq"
      });
    }

    // Handle greetings
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return NextResponse.json({
        success: true,
        response: "Hello! I'm your AI medical assistant. I can help answer questions about our medical services, appointments, general health information, and guide you to appropriate care. How can I assist you today?",
        source: "greeting"
      });
    }

    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return NextResponse.json({
        success: true,
        response: "You're welcome! If you have any other questions about our medical services, health information, or need help booking an appointment, feel free to ask.",
        source: "thanks"
      });
    }

    // For complex medical queries, use Gemini AI
    const aiResponse = await getAIResponse(userMessage);
    
    return NextResponse.json({
      success: true,
      response: aiResponse,
      source: "ai"
    });
    
  } catch (error) {
    console.error("Chatbot API error:", error);
    
    // Fallback response for when AI fails
    const fallbackResponse = `I understand you have a medical question. While I can provide general health information, I recommend scheduling an appointment with one of our healthcare providers for personalized medical advice.

For urgent concerns, please call our office directly at our clinic hours (Mon-Fri 9AM-9PM, Sat 9AM-5PM) or seek immediate medical attention if it's an emergency.

Would you like help booking an appointment? You can use the 'Book Appointment' feature in the navigation menu.`;
    
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
