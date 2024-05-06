const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = require("./routes/handler");
const connectDB = require("./db/connectDB");
require("dotenv").config()
const port = 4000;
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use("/api/v1", router)

app.listen(port, async()=>{
    console.log(`Server runnin on port ${port}`);
    await connectDB("DB connected successfully!!!")
})