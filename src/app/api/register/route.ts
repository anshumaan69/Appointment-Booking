import connectDB from "@/utils/dbconfig"
import User from "@/models/user"
import {hashPassword} from "@/lib/hash"



export async function POST(req: Request){
    await connectDB();
    const {name,email,password} = await req.json()


    const existing = await User.findOne({email})
    if(existing){
        return Response.json({error:"User already exists",status:400})
    }


    const hashed = await hashPassword(password)

    await User.create({
        name,
        email,
        password:hashed
    })



    return Response.json({success:true})



}
