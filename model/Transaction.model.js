const mongoose = require("mongoose");
const {Schema, model} = mongoose
const TransactionSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    TransactionType : {
        type:String,
        enum: ["credit", "debit"],
        required: true
    },
    TransactionStatus : {
        type:String,
        enum: ["pending", "completed", "cancel"],
        required: true
    },
    details:{
        type:String,
        required:true
    }
});

const Transaction = new model("Transaction", TransactionSchema);

module.exports = Transaction;