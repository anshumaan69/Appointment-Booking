import mongoose from "mongoose"


const serviceShema=({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})


export default mongoose.models.Service || mongoose.model("Service",serviceShema)
