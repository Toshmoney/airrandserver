const mongoose = require("mongoose");
const {Schema, model} = mongoose
const messageSchema = new Schema({
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

const Message = new model("Message", messageSchema);

module.exports = Message;