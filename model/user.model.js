const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 10 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 
    },
    password: {
      type: String,
      minlength: 6
    },
    profilePicture: {
      type: String
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    userType: {
      type: String,
      required: true,
      enum: ["tasker", "client", "admin"]
    },
    profileDescription: {
      type: String
    },
    skillsets: [{
        skillTitle: { type: String, required: true },
        skills: [{ type: String }]
      }],
    jobTitle: {
      type: String
    },
    location: {
      type: String
    },
    accountStatus: {
      type: String,
      required: true,
      enum: ["active", "suspended", "ban"],
      default: "active"
    },
    availability: {
      type: Boolean,
      default: true
    },

    resetToken: String,
    resetExpires: Date,
  },
  {
    timestamps: true
  }
);

// Hashing of password before saving my userschema
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
