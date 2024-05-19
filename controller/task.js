const multer  = require('multer')
const taskModel = require("../model/Task.model.js");
const upload = multer({ dest: 'uploads/' })

const createTask = async (req, res) => {
    try {
        const { title, description, price, duration, projectType, location, skills } = req.body;

        if (!title || !description || !price || !duration || !projectType || !location || !skills) {
            return res.status(400).json({ error: "Please fill all fields" });
        }

        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ error: "Price must be a positive number" });
        }

        if (isNaN(duration) || duration <= 0) {
            return res.status(400).json({ error: "Duration must be a positive number" });
        }

        let taskImage;
        if (req.files && req.files.taskImage) {
            taskImage = req.files.taskImage.name;
            const uploadPath = __dirname + '/uploads/' + taskImage;

            req.files.taskImage.mv(uploadPath, function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
            });
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
        });

        await createdTask.save();

        res.status(201).json({ message: "New Task created successfully!!", createdTask });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
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