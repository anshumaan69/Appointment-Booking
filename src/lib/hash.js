import bcrypt from "bcryptjs"


const hashPassword = async (password) =>{
    return await bcrypt.hash(password,10)
}

const comparePassword = async (password,hashed)=>{
    return await bcrypt.compare(password,hashed)
}


export {hashPassword,comparePassword}