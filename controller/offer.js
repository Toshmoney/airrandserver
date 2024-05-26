const taskModel = require("../model/Task.model");
const User = require("../model/User.model");
const Wallet = require("../model/Wallet.model");
const offerModel = require("../model/offer.model");


const offerTaskByClient = async (req, res) => {
    try {
        const { taskId, taskerId } = req.params;
        const clientId = req.user._id;

        // Validate that the task exists and belongs to the client
        const task = await taskModel.findOne({ _id: taskId, client: clientId });
        if (!task) {
            return res.status(404).json({ error: "Task not found or you do not have permission to offer it" });
        }

        // Validate that the tasker exists
        const tasker = await User.findById(taskerId);
        if (!tasker) {
            return res.status(404).json({ error: "Tasker not found" });
        }

        task.taskStatus = 'in-progress';
        task.tasker = taskerId;

        // Create the offer
        const offer = new offerModel({
            task: taskId,
            tasker: taskerId,
            client: clientId,
        });

        await offer.save();
        await task.save()

        return res.status(201).json({ message: "Task offered to tasker successfully!", offer });
    } catch (error) {
        return res.status(500).json({ error: error.message || "Error while offering the task" });
    }
};

const acceptOfferByTasker = async (req, res) => {
    try {
        const { offerId } = req.params;
        const taskerId = req.user._id;

        // Validate that the offer exists and belongs to the tasker
        const offer = await offerModel.findOne({ _id: offerId, tasker: taskerId });
        if (!offer) {
            return res.status(404).json({ error: "Offer not found or you do not have permission to accept it" });
        }

        // Update offer status
        offer.status = 'accepted';
        await offer.save();

        // Update task status
        const task = await taskModel.findById(offer.task);
        if (task) {
            task.taskStatus = 'in-progress';
            task.tasker = taskerId;
            await task.save();
        }

        return res.status(200).json({ message: "Offer accepted successfully!", offer });
    } catch (error) {
        return res.status(500).json({ error: error.message || "Error while accepting the offer" });
    }
};

const rejectOfferByTasker = async (req, res) => {
    try {
        const { offerId } = req.params;
        const taskerId = req.user._id;

        // Validate that the offer exists and belongs to the tasker
        const offer = await offerModel.findOne({ _id: offerId, tasker: taskerId });
        if (!offer) {
            return res.status(404).json({ error: "Offer not found or you do not have permission to reject it" });
        }

        // Update offer status
        offer.status = 'rejected';
        await offer.save();

        // Optionally, update task status if needed
        const task = await taskModel.findById(offer.task);
        if (task) {
            task.taskStatus = 'pending';
            task.tasker = null; 
            await task.save();
        }

        return res.status(200).json({ message: "Offer rejected successfully!", offer });
    } catch (error) {
        return res.status(500).json({ error: error.message || "Error while rejecting the offer" });
    }
};

const markTaskAsCompletedByTasker = async(req, res)=>{
    try {
        const { offerId } = req.params;
        const taskerId = req.user._id;

        // Validate that the offer exists and belongs to the tasker
        const offer = await offerModel.findOne({ _id: offerId, tasker: taskerId });
        if (!offer) {
            return res.status(404).json({ error: "Offer not found or you do not have permission to complete it" });
        }

        // Update offer status to completed
        offer.status = 'completed';
        await offer.save();

        // Update task status to completed
        const task = await taskModel.findById(offer.task);
        if (task) {
            task.taskStatus = 'completed';
            await task.save();
        }

        return res.status(200).json({ message: "Offer marked as completed successfully!", offer });
    } catch (error) {
        return res.status(500).json({ error: error.message || "Error while marking the offer as completed" });
    }
};

const acknowledgeTaskCompletionByClient = async (req, res) => {
    try {
        const { taskId } = req.params;
        const clientId = req.user._id;

        // Validate that the task exists and belongs to the client
        const task = await taskModel.findOne({ _id: taskId, client: clientId });
        if (!task) {
            return res.status(404).json({ error: "Task not found or you do not have permission to acknowledge it" });
        }

        if (task.taskStatus !== 'completed') {
            return res.status(400).json({ error: "Task is not yet marked as completed by the tasker" });
        }

        // Update task status to acknowledged
        task.taskStatus = 'acknowledged';
        await task.save();

        // Find the offer associated with this task and update its status
        const offer = await offerModel.findOne({ task: taskId, tasker: task.tasker });
        if (!offer) {
            return res.status(404).json({ error: "Offer not found" });
        }
        offer.status = 'acknowledged';
        await offer.save();

        // Look for the tasker wallet
        let taskerWallet = await Wallet.findOne({user:task.tasker})

        // if no wallet found, create a new wallet for tasker
        if (!taskerWallet) {
            taskerWallet = new Wallet({
                user: task.tasker,
                balance: 0,
            })
        }

        // Add the task price to the tasker's wallet balance
        taskerWallet.balance += task.price;
        await taskerWallet.save();

        return res.status(200).json({ message: "Task acknowledged and tasker's wallet updated successfully!" });
    } catch (error) {
        return res.status(500).json({ error: error.message || "Error while acknowledging the task" });
    }
};


module.exports = {
    rejectOfferByTasker,
    acceptOfferByTasker,
    offerTaskByClient,
    markTaskAsCompletedByTasker,
    acknowledgeTaskCompletionByClient
}