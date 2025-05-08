const mongoose = require('mongoose');

const reviewSchema= new mongoose.Schema({
    stars:{
        type:Number,
        // default:3
    },
    comment:{
        type:String,
        required:true
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    createdAt:{
        type:Date,
        default:Date()
    },
})

module.exports=new mongoose.model("Review",reviewSchema);

