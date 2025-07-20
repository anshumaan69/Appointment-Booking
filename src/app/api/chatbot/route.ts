import { NextResponse } from "next/server";

interface ChatMessage {
  message: string;
}

const doctorFAQs: Record<string, string> = {
  "book appointment": "To book an appointment, click on 'Book Appointment' in the navigation menu. You can select your preferred date, time, and service. Our available services include consultations, check-ups, and specialized treatments.",
  
  "appointment hours": "Our clinic hours are Monday to Friday 9:00 AM to 9:00 PM, and Saturday 9:00 AM to 5:00 PM. We're closed on Sundays and public holidays.",
  
  "cancel appointment": "You can cancel your appointment up to 24 hours before your scheduled time. Please contact us as soon as possible if you need to cancel or reschedule.",
  
  "reschedule": "To reschedule your appointment, please cancel your current booking and create a new one with your preferred time slot. You can also call our office for assistance.",
  
  "services": "We offer general consultations, health check-ups, preventive care, chronic disease management, vaccinations, minor procedures, and specialist referrals.",
  
  "consultation": "A general consultation includes a comprehensive health assessment, discussion of your symptoms or concerns, physical examination if needed, and treatment recommendations.",
  
  "check up": "Our health check-ups include vital signs monitoring, basic health screening, lifestyle assessment, and preventive care recommendations. Regular check-ups help maintain your overall health.",
  
  "prepare for visit": "Please bring a valid ID, insurance card (if applicable), list of current medications, and any relevant medical records. Arrive 15 minutes early for check-in.",
  
  "what to bring": "Bring your ID, insurance information, current medications list, previous test results, and any questions you'd like to discuss with the doctor.",
  
  "first visit": "For your first visit, please arrive 30 minutes early to complete registration forms. Bring your medical history, current medications, and insurance information.",
  
  "insurance": "We accept most major insurance plans. Please contact our office to verify if your specific insurance is accepted. We also offer self-pay options.",
  
  "payment": "We accept cash, credit cards, debit cards, and most insurance plans. Payment is due at the time of service unless prior arrangements have been made.",
  
  "cost": "Consultation fees vary by service type. Please contact our office for specific pricing information. We'll provide a cost estimate before your appointment.",
  
  "emergency": "For medical emergencies, please call 911 or go to your nearest emergency room immediately. Our clinic handles non-emergency appointments and routine care.",
  
  "urgent care": "For urgent but non-emergency issues, please call our office. We may be able to accommodate same-day appointments or provide guidance on appropriate care.",
  
  "prescription": "Prescriptions can be sent electronically to your preferred pharmacy. Please provide your pharmacy information during your visit. Prescription refills may require a follow-up appointment.",
  
  "medication": "Please bring a complete list of all medications, supplements, and vitamins you're currently taking. This includes over-the-counter medications and herbal supplements.",
  
  "test results": "Test results are typically available within 2-5 business days. We'll contact you with results and any necessary follow-up instructions. You can also access results through our patient portal.",
  
  "follow up": "Follow-up appointments are scheduled based on your specific needs and treatment plan. The doctor will discuss timing during your visit.",
  
  "preventive care": "We emphasize preventive care including regular screenings, vaccinations, lifestyle counseling, and early detection of health issues. Prevention is key to maintaining good health.",
  
  "healthy lifestyle": "We provide guidance on nutrition, exercise, stress management, sleep hygiene, and other lifestyle factors that impact your health and wellbeing.",
  
  "contact": "You can reach our office during business hours for appointments, questions, or concerns. After hours, please call for urgent matters or visit the emergency room for emergencies.",
  
  "location": "Our clinic is conveniently located with easy access and parking. Detailed directions and parking information are available on our website.",
  
  "patient portal": "Our patient portal allows you to view test results, request prescription refills, send messages to your care team, and manage your appointments online.",
  
  "telemedicine": "We offer telemedicine appointments for certain types of consultations. Please ask if your condition is suitable for a virtual visit."
};

function findBestMatch(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  for (const [key, response] of Object.entries(doctorFAQs)) {
    if (message.includes(key)) {
      return response;
    }
  }
  
  if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
    return "Hello! I'm here to help answer your questions about our medical services, appointments, and general health information. How can I assist you today?";
  }
  
  if (message.includes("thank") || message.includes("thanks")) {
    return "You're welcome! If you have any other questions about our medical services or need help booking an appointment, feel free to ask.";
  }
  
  if (message.includes("help")) {
    return "I can help you with information about:\\n• Booking and managing appointments\\n• Our medical services and consultations\\n• Clinic hours and location\\n• Insurance and payment options\\n• Preparing for your visit\\n• General health questions\\n\\nWhat would you like to know?";
  }
  
  return "I'd be happy to help! I can provide information about booking appointments, our medical services, clinic hours, insurance, and general health questions. Could you please rephrase your question or ask about one of these topics?";
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
    
    const response = findBestMatch(userMessage);
    
    return NextResponse.json({
      success: true,
      response: response
    });
    
  } catch (error) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      { 
        error: "Failed to process your message. Please try again.",
        response: "I'm sorry, I'm having trouble processing your request right now. Please try again or contact our office directly for assistance."
      },
      { status: 500 }
    );
  }
}
