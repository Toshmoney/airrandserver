const multer  = require('multer')
const taskModel = require("../model/Task.model.js");
const upload = multer({ dest: 'uploads/' })

const createTask = async(req, res)=>{
    try {
        const {title, description, price, duration, projectType, location, skills} = req.body;
        if(!title || !description || !price || !duration || !projectType || !location || !skills){
            return res.status(400).json({error: "Please fill all fields"})
        }

        let taskImage;

        if(req.file){
            profilePicture = req.file.taskImage
        }

        const createdTask = new taskModel({
            title,
            description,
            price,
            duration,
            projectType,
            location,
            skills,
            client: req.user._id,
            taskImage
        })

        await createdTask.save();
        res.status(201).json({message: "New Task created successfully!!", createdTask})
    } catch (error) {
        console.log(error.message);
        res.json({error: error.message});
    }
};

const getAllTasks = async(req, res)=>{
    const foundTasks = await taskModel.find();
    if(!foundTasks) return res.status(404).json({error: "No task created yet"})
    res.status(200).json({foundTasks})
};

const getSingleTask = async(req, res)=>{
    const {taskId} = req.params;
    const foundTask = await taskModel.findById({_id : taskId});

    if(!foundTask) return res.status(404).json({error: "This task does not exist or has been deleted"})
    return res.status(200).json({foundTask})
}

const getAllTasksByClient = async(req, res)=>{
    const foundTasks = await taskModel.find({client: req.user_id});
    if(!foundTasks) return res.status(404).json({error: "No task created yet"})
    res.status(200).json({foundTasks})
};

const getAllTasksByTasker = async(req, res)=>{
    const foundTasks = await taskModel.find({tasker: req.user_id});
    if(!foundTasks) return res.status(404).json({error: "No task availabled yet"})
    res.status(200).json({foundTasks})
};


const getTasksAndUpdateByClient = async(req, res)=>{
    const {taskId} = req.params
    const foundTask = await taskModel.findOne({client: req.user_id});
    if(!foundTask) return res.status(404).json({error: "No task created yet"})
    const updatedTask = await taskModel.findOneAndUpdate(taskId, req.body, {rurnValidator:true})
    res.status(200).json({updatedTask})
};



module.exports ={
    createTask,
    getAllTasks,
    getSingleTask,
    getAllTasksByClient,
    getAllTasksByTasker,
    getTasksAndUpdateByClient
}