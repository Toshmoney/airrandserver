const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const giveawaySchema = new Schema({
    giver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bids: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        bidAt: {
            type: Date,
            default: Date.now
        }
    }],
    winner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["open", "closed", "awarded"],
        default: "open"
    }
});

const Giveaway = model("Giveaway", giveawaySchema);

module.exports = Giveaway;
