/*
 * SERVICES API - Step by Step TODO List
 * 
 * This file handles getting all available services for the appointment booking system.
 * The SelectDemo component in booking form needs this to show real services instead of hardcoded ones.
 * 
 * STEP 1: Import required dependencies
 * - Import connectDB from "@/utils/dbconfig"
 * - Import Service model from "@/models/service"
 * - Import NextResponse for proper API responses
 * 
 * STEP 2: Create GET function to fetch all services
 * - Connect to database using connectDB()
 * - Use Service.find() to get all services
 * - Return services in JSON format
 * - Handle errors properly
 * 
 * STEP 3: Create POST function to add new services (for admin)
 * - Connect to database
 * - Get { name, description, duration, price } from request body
 * - Create new Service using Service.create()
 * - Return success response
 * 
 * STEP 4: Test the API
 * - Test GET /api/services in browser or Postman
 * - Should return empty array initially
 * - Test POST to add a few sample services
 * - Test GET again to see services
 * 
 * STEP 5: Update SelectDemo component
 * - Replace hardcoded services with API call
 * - Use useEffect to fetch services on component mount
 * - Update dropdown options dynamically
 */

// TODO: Implement the above steps

import connectDB from "@/utils/dbconfig";
import Service from "@/models/service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const services = await Service.find();
        return NextResponse.json(services);
    } catch (error) {
        console.error("Error fetching services:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { name, description, duration, price } = body;
        const newService = await Service.create({ name, description, duration, price });

        return NextResponse.json(newService, { status: 201 });
    } catch (error) {
        console.error("Error creating service:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
