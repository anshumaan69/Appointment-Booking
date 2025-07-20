import connectDB from "@/utils/dbconfig";
import Appointment from "@/models/appointment";
import Service from "@/models/service";
import { getUserFromToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await connectDB();
        
        // Get request body
        const body = await request.json();
        const { serviceId, date, timeSlot } = body;
        
        // Get auth token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        
        if (!token) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }
        
        // Verify token to get current user ID
        const decoded = getUserFromToken(token);
        const userId = decoded.id;
        
        // Validate required fields
        if (!serviceId || !date || !timeSlot) {
            return NextResponse.json({ error: "Missing required fields: serviceId, date, timeSlot" }, { status: 400 });
        }
        
        // Basic date validation
        const appointmentDate = new Date(date);
        if (isNaN(appointmentDate.getTime())) {
            return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
        }
        
        if (appointmentDate < new Date()) {
            return NextResponse.json({ error: "Cannot book appointments in the past" }, { status: 400 });
        }
        
        // Basic time validation
        const timeSlotPattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
        if (!timeSlotPattern.test(timeSlot)) {
            return NextResponse.json({ error: "Invalid time format. Use HH:MM:SS format (e.g., 09:00:00)" }, { status: 400 });
        }
        
        // Basic validation - check if service exists
        const service = await Service.findById(serviceId);
        if (!service) {
            return NextResponse.json({ error: "Service not found" }, { status: 404 });
        }
        
        // Simple conflict check - prevent double booking same time slot
        const existingAppointment = await Appointment.findOne({
            date: date,
            timeSlot: timeSlot,
            //This returns the quesry having status not equals cancelled
            status: { $ne: "cancelled" }
        });
        
        if (existingAppointment) {
            return NextResponse.json({ 
                error: "Time slot already booked. Please choose a different time."
            }, { status: 409 });
        }
        
        // Create new appointment
        const newAppointment = await Appointment.create({
            user: userId,
            service: serviceId,
            date: date,
            timeSlot: timeSlot,
            status: "booked"
        });
        
        // Populate the appointment with user and service details for response
        const populatedAppointment = await Appointment.findById(newAppointment._id)
            .populate('user', 'name email')
            .populate('service', 'name description duration price');
        
        return NextResponse.json({ 
            success: true, 
            message: "Appointment booked successfully",
            appointment: populatedAppointment 
        }, { status: 201 });
        
    } catch (error) {
        console.error("Error creating appointment:", error);
        return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
    }
}