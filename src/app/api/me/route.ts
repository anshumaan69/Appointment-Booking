import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/auth";
import User from "@/models/user";
import connectDB from "@/utils/dbconfig"

export async function GET(){
    await connectDB()
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if(!token ){
        return Response.json({error:"Unauthorized",status:401})
    
    }
    try {
        const decoded = getUserFromToken(token)
        const user = await User.findById(decoded.id).select("-password")
        return Response.json({success:true,user})
        
    } catch {
        return Response.json({error:"Unauthorized",status:401})
        
    }
    
        
}
