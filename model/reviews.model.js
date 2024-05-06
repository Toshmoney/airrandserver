const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    tasker: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
      },
    taskerRating: {
      type: Number,
      min: 1,
      max: 5
    },
    taskerComment: {
      type: String
    },
    clientRating: {
      type: Number,
      min: 1,
      max: 5
    },
    clientComment: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

const Review = model("Review", reviewSchema);

module.exports = Review;
