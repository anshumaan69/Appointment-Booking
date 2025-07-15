import connectDB from "@/utils/dbconfig"
import User from "@/models/user"
import { comparePassword } from "@/lib/hash"
import {generateToken,setTokenCookie} from "@/lib/auth"

export async function POST(req: Request){
    await connectDB();
    const {email,password} = await req.json()

    const user = await User.findOne({email})
    if(!user){
        return Response.json({error:"User not found",status:400})
    }

    const isMatch = await comparePassword(password,user.password)
    if(!isMatch){
        return Response.json({error:"Invalid password",status:400})
    }

    const token = generateToken(user)
    setTokenCookie(token)

    return Response.json({success:true,user:{
        name:user.name,
        email:user.email,
    }})

}