const express = require("express");
const {
    createTask,
    getAllTasksByClient,
    getTasksAndUpdateByClient,
    deleteTaskByClient,
    getSingleTask,
} = require("../controller/task");

const { isLoggin, isVerified } = require("../middleware/authentication");

const {

    offerTaskByClient,
    acknowledgeTaskCompletionByClient
    
} = require("../controller/offer");


const router = express.Router();


router.route("/create-task").post([isLoggin, isVerified], createTask);
router.route("/task:taskId").get([isLoggin], getSingleTask);
router.route("/get-all-posted-tasks").get([isLoggin, isVerified], getAllTasksByClient);
router.route("/edit-tasks:taskId").patch([isLoggin, isVerified], getTasksAndUpdateByClient);
router.route("/delete-tasks:taskId").delete([isLoggin, isVerified], deleteTaskByClient);
router.route("/offer-task/:taskId/:taskerId").post([isLoggin, isVerified], offerTaskByClient)
router.route("/acknowledge-completion/:taskId").post([isLoggin, isVerified], acknowledgeTaskCompletionByClient)

module.exports = router;