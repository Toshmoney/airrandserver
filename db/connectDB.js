const mongoose = require("mongoose");
require("dotenv").config()
const connectionString = process.env.connectdb
const connectDB = async(msg)=>{
    console.log(msg);
    await mongoose.connect(connectionString)
}

module.exports = connectDB;