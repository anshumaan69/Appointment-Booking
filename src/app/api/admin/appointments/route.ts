import connectDB from "@/utils/dbconfig";
import Appointment from "@/models/appointment";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await connectDB();
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    const decodedData = getUserFromToken(token);
    const currentUser = await User.findById(decodedData.id);
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    
    const appointments = await Appointment.find({})
      .populate('user', 'name email')
      .populate('service', 'name duration price')
      .sort({ date: -1 });
    
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
