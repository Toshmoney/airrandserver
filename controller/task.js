const multer  = require('multer')
const taskModel = require("../model/Task.model.js");
const Wallet = require("../model/Wallet.model.js")
const upload = multer({ dest: 'uploads/' })

const createTask = async (req, res) => {
    try {
        const { title, description, price, duration, projectType, location, skills } = req.body;

        
        // Check for missing fields
        if (!title || !description || !price || !duration || !projectType || !location || !skills) {
            return res.status(400).json({ error: "Please fill all fields" });
        }

        // Validate price
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ error: "Price must be a positive number" });
        }

        // Validate duration
        if (isNaN(duration) || duration <= 0) {
            return res.status(400).json({ error: "Duration must be a positive number" });
        }

        const user = req.user;

        // Fetch user's wallet
        let wallet = await Wallet.findOne({ user: user });
        if (!wallet) {
            wallet = new Wallet({
                user: user,
                balance: 0,
            });
        }

        // Check if user has sufficient balance
        if (wallet.balance < price) {
            return res.status(400).json({ error: "Insufficient funds in user wallet" });
        }

        // Deduct task price from user's balance
        wallet.balance -= price;
        await wallet.save();

        // Handle file upload if at all included by the client present
        let taskImage;
        if (req.files && req.files.taskImage) {
            taskImage = req.files.taskImage.name;
            const uploadPath = __dirname + '/uploads/' + taskImage;

            // Move the uploaded file to the desired location
            await new Promise((resolve, reject) => {
                req.files.taskImage.mv(uploadPath, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }

        // Create a new task
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

        // Save the new task to the database
        await createdTask.save();

        // Respond with success message and the created task
        res.status(201).json({ message: "New Task created successfully!!", createdTask });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

// Getting all tasks for tasker to pick interested job
const getAllTasks = async (req, res) => {
    try {
        const foundTasks = await taskModel.find();

        if (foundTasks.length === 0) {
            return res.status(404).json({ error: "No tasks created yet" });
        }

        return res.status(200).json({ tasks: foundTasks });
    } catch (error) {
        return res.status(500).json({ error: error.message || "Error while fetching tasks" });
    }
};


const getSingleTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const foundTask = await taskModel.findById(taskId);

        if (!foundTask) {
            return res.status(404).json({ error: "This task does not exist or has been deleted" });
        }

        return res.status(200).json({ task: foundTask });
    } catch (error) {
        return res.status(500).json({ error: error.message || "Error while fetching the task" });
    }
};


// Task user has posted

const getAllTasksByClient = async (req, res) => {
    try {
        const foundTasks = await taskModel.find({ client: req.user._id });

        if (foundTasks.length === 0) {
            return res.status(404).json({ error: "No tasks created yet" });
        }

        return res.status(200).json({ tasks: foundTasks });
    } catch (error) {
        return res.status(500).json({ error: error.message || "Error while fetching tasks" });
    }
};


// This is for the task user has bid on
const getAllTasksByTasker = async (req, res) => {
    try {
        const foundTasks = await taskModel.find({ tasker: req.user._id });

        if (foundTasks.length === 0) {
            return res.status(404).json({ error: "No tasks available yet" });
        }

        return res.status(200).json({ tasks: foundTasks });
    } catch (error) {
        return res.status(500).json({ error: error.message || "Error while fetching tasks" });
    }
};


// Allowing client to edit their tasks
const getTasksAndUpdateByClient = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { _id: clientId } = req.user;

        const foundTask = await taskModel.findOne({ _id: taskId, client: clientId });
        if (!foundTask) {
            return res.status(404).json({ error: "Task not found or you do not have permission to edit it" });
        }

        const updatedTask = await taskModel.findByIdAndUpdate(taskId, req.body, { new: true, runValidators: true });
        if (!updatedTask) {
            return res.status(400).json({ error: "Failed to update the task" });
        }

        return res.status(200).json({ message: "Task updated successfully", updatedTask });
    } catch (error) {
        return res.status(500).json({ error: error.message || "Error while updating the task" });
    }
};


const deleteTaskByClient = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await taskModel.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task does not exist!" });
        }

        if (task.client.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You cannot delete a task you didn't create!" });
        }

        await taskModel.findByIdAndDelete(taskId);

        return res.status(200).json({ message: "Task deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Error while deleting a task" });
    }
};

const deleteTaskByAdmin = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await taskModel.findById(taskId);

        if (!task) {
            return res.status(404).json({ error: "Task not found or has been deleted!" });
        }

        await taskModel.findByIdAndDelete(taskId);

        return res.status(200).json({ message: "Task deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ error: error.message || "Error while deleting the task" });
    }
};





module.exports ={
    createTask,
    getAllTasks,
    getSingleTask,
    getAllTasksByClient,
    getAllTasksByTasker,
    getTasksAndUpdateByClient,
    deleteTaskByClient,
    deleteTaskByAdmin,
}