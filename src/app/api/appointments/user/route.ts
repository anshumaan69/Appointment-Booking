/*
 * USER APPOINTMENTS API - Step by Step TODO List
 * 
 * This file handles getting all appointments for the current logged-in user.
 * The Dashboard component needs this to show user's upcoming appointments.
 * 
 * STEP 1: Import required dependencies
 * - Import connectDB from "@/utils/dbconfig"
 * - Import Appointment model from "@/models/appointment"
 * - Import { verifyToken } from "@/lib/auth" (to get current user)
 * - Import { cookies } from "next/headers" (to get auth token)
 * 
 * STEP 2: Create GET function to fetch user appointments
 * - Connect to database using connectDB()
 * - Get auth token from cookies
 * - Verify token to get current user ID
 * - Use Appointment.find({ user: userId }) to get user's appointments
 * - Populate service details using .populate('service')
 * - Sort by date (newest first or upcoming first)
 * - Return appointments in JSON format
 * 
 * STEP 3: Add filtering options (optional)
 * - Filter by status (booked, cancelled, completed)
 * - Filter by date range
 * - Add query parameters support
 * 
 * STEP 4: Handle authentication
 * - Check if user is logged in
 * - Return 401 if no token
 * - Return 403 if token is invalid
 * 
 * STEP 5: Test the API
 * - Test GET /api/appointments/user when logged in
 * - Test without login (should return error)
 * - Test with some sample appointments
 * 
 * STEP 6: Update Dashboard component
 * - Add useEffect to fetch appointments on component mount
 * - Display appointments in a nice format
 * - Show appointment details (service, date, time, status)
 * - Add loading and error states
 * 
 * STEP 7: Optional enhancements
 * - Add pagination for many appointments
 * - Add cancel appointment functionality
 * - Add reschedule appointment functionality
 */

// TODO: Implement the above steps

import connectDB from "@/utils/dbconfig";
import Appointment from "@/models/appointment";
import { getUserFromToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        await connectDB();
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if(!token){
            return NextResponse.json({error:"Authentication required"},{status:401})
        }
        const decodedData = getUserFromToken(token)
        const userId = decodedData.id
        const appointments = await Appointment.find({user:userId}).populate('service').sort({date:1})
        return NextResponse.json(appointments)

        
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return NextResponse.json({error:"Internal Server Error"},{status:500})
        
    }
}