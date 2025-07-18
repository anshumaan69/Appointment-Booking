import connectDB from "@/utils/dbconfig";
import Appointment from "@/models/appointment";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (!date) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
    }
    
    // Find all booked appointments for the specific date
    const bookedAppointments = await Appointment.find({
      date: date,
      status: { $ne: "cancelled" }
    }).select('timeSlot');
    
    // Extract just the time slots
    const bookedTimeSlots = bookedAppointments.map(apt => apt.timeSlot);
    
    return NextResponse.json({ bookedSlots: bookedTimeSlots });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
