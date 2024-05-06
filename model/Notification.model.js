const mongoose = require("mongoose");
const {Schema, model} = mongoose
const notificationSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    message : {
        type: String,
        required: true,
    },
    hasRead : {
        type: Boolean,
        required: true,
        default:false
    }
});

const Notification = new model("Notification", notificationSchema);

module.exports = Notification;