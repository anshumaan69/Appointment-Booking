import { clearTokenCookie } from "@/lib/auth";

export async function POST(){
    await clearTokenCookie()
    return Response.json({success:true})

}