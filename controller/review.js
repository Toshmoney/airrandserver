const taskModel = require("../model/Task.model");
const Review = require("../model/reviews.model");


const createReview = async(req, res)=>{
    const {taskerRating, taskerComment, clientRating, clientComment} = req.body;
    const {taskId} = req.params;
    const foundTask = await taskModel.findById({_id: taskId});
    if(!foundTask) return res.status(404).json({error: "Task not found!"})
    
    const tasker = foundTask.tasker
    const client = foundTask.client
    const newReview = new Review({
        task:foundTask._id,
        tasker,
        client,
        taskerRating: taskerRating ? taskerRating : 0,
        taskerComment,
        clientComment,
        clientRating: clientRating? clientRating : 0,
    });

    await newReview.save();
    return res.status(201).json({message: "Review Created Successfully", foundTask})
};

const getReview = async(req, res)=>{
    const {taskId} = req.params;
    const foundTask = await taskModel.findById({_id: taskId});
    if(!foundTask) return res.status(404).json({error: "Task not found!"})
    return res.status(200).json({foundTask}).populate("review")
};

module.exports = {
    getReview,
    createReview
}