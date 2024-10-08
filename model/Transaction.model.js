const mongoose = require("mongoose");
const {Schema, model} = mongoose
const TransactionSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    amount:{
        type:Number,
        required:true
    },

    TransactionType : {
        type:String,
        enum: ["credit", "debit"],
        required: true
    },
    TransactionStatus : {
        type:String,
        enum: ["pending", "completed", "failed"],
        required: true
    },
    details:{
        type:String,
        required:true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    reference_number:{
        type:String,
        trim:true
    }
});

const Transaction = new model("Transaction", TransactionSchema);

module.exports = Transaction;