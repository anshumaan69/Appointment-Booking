import jwt from "jsonwebtoken";
import {cookies} from "next/headers"


export const generateToken = (user)=>{
    return  jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:"7d"})
}   


export const setTokenCookie = async (token)=>{

    await cookies().set("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        maxAge:7*24*60*60,
        path:"/"
    })
}


export const clearTokenCookie = async ()=>{
    await cookies().set("token","",{maxAge:0,path:"/"})
}


export const getUserFromToken = (token)=>{
    return jwt.verify(token,process.env.JWT_SECRET)
}