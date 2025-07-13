import mongoose from "mongoose"


const availablitySchema = new mongoose.Schema({
    date:{
        type:String,
        required:true
    },
    timeSlot:{
        type:String,
        required:true
    },
    isBooked:{
        type:Boolean,
        default:false
    },
    service:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Service',
        required:true
    }
}
)



export default mongoose.models.Availability || mongoose.model("Availability",availablitySchema)