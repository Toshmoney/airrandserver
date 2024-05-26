const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const offerSchema = new Schema({
    status: {
        type:String,
        required:true,
        enum:["pending", "accepted", "rejected", "completed", "acknowledged"],
        default: "pending"
    },
    client:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    tasker: {
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    task :{
        type:Schema.Types.ObjectId,
        ref:"Task"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const offerModel = new model("Offer", offerSchema);

module.exports = offerModel