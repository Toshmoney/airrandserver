const mongoose = require("mongoose");
require("dotenv").config()
const connectionString = process.env.connectdb
const connectDB = async(msg)=>{
    await mongoose.connect(connectionString)
    return console.log(msg);
}

module.exports = connectDB;