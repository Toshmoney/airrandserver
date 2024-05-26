const express = require("express");
const {
    createTask,
    getAllTasksByClient,
    getTasksAndUpdateByClient,
    deleteTaskByClient,
    getSingleTask,
} = require("../controller/task");

const { isLoggin, isVerified, checkUserPin, verifyUserPin } = require("../middleware/authentication");

const {

    offerTaskByClient,
    acknowledgeTaskCompletionByClient
    
} = require("../controller/offer");

const {
    createGiveaway,
    awardGiveaway,
    editGiveaway,
    getGiveaway,
    deleteGiveaway
} = require("../controller/giveaway")

const router = express.Router();


router.route("/create-task").post([isLoggin, isVerified], createTask);
router.route("/task:taskId").get([isLoggin], getSingleTask);
router.route("/get-all-posted-tasks").get([isLoggin, isVerified], getAllTasksByClient);
router.route("/edit-tasks:taskId").patch([isLoggin, isVerified], getTasksAndUpdateByClient);
router.route("/delete-tasks:taskId").delete([isLoggin, isVerified], deleteTaskByClient);
router.route("/offer-task/:taskId/:taskerId").post([isLoggin, isVerified], offerTaskByClient)
router.route("/acknowledge-completion/:taskId").post([isLoggin, isVerified], acknowledgeTaskCompletionByClient)

// Giveaway
router.route("/giveaway").post([isLoggin, isVerified, verifyUserPin], createGiveaway)
router.route("/giveaway/:giveawayId").get([isLoggin], getGiveaway)
router.route("/giveaway/:giveawayId").put([isLoggin, isVerified,], editGiveaway)
router.route("/giveaway/:giveawayId").put([isLoggin, isVerified,], deleteGiveaway)
router.route("/giveaway/:giveawayId/award/:winnerId").post([isLoggin, isVerified, verifyUserPin], awardGiveaway)

module.exports = router;