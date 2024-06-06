const express = require("express");
const app = express();
const cors = require("cors")
const fileUpload = require('express-fileupload');
const bodyParser = require("body-parser");
const router = require("./routes/handler");
const chatRouter = require("./routes/messageRoutes");
const clientRouter = require("./routes/clientHandler")
const adminRouter = require("./routes/adminRoutes")
const connectDB = require("./db/connectDB");
require("dotenv").config()
const port = 4000;
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

app.use(express.json());
app.use(fileUpload());
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))

app.get("/", (req, res)=>{
    res.send("working")
})

app.use("/user", router)
app.use("/chats", chatRouter)
app.use("/client", clientRouter)
app.use("/admin", adminRouter)

// app.all("*", (req, res)=>{
//     res.status(404).json({error:"The endpoint you are looking for does not exists!"})
// })

app.listen(port, async()=>{
    console.log(`Server runnin on port ${port}`);
    await connectDB("DB connected successfully!!!")
})