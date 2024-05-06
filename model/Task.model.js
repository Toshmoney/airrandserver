const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const taskSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        required:true
    },

    taskStatus: {
        type:String,
        required:true,
        enum:["pending", "in-progress", "completed", "cancel"],
        default: "pending"
    },
    client:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    tasker: {
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    taskImage :{
        type:String,
    },
    duration:{
        type:String,
    },
    projectType:{
        type:String,
    },
    location:{
        type:String,
    },
    skills:{
        type:Array,
    }
});

const taskModel = new model("Task", taskSchema);

module.exports = taskModel