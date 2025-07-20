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