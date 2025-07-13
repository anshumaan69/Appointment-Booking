import mongoose from "mongoose"
const appointmentSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    service:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Service',
        required:true
    },
    date:{
        type:String,
        required:true
    },
    timeSlot:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["booked","cancelled","completed"],
        default:"booked"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})



export default mongoose.models.Appointment || mongoose.model("Appointment",appointmentSchema)