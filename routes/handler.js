const express = require("express");
const { register, login } = require("../controller/auth");
const {
    getSingleTask,
    getAllTasks,
    getAllTasksByTasker
} = require("../controller/task");

const { isLoggin, isVerified, checkUserPin } = require("../middleware/authentication");

const {
    acceptOfferByTasker,
    rejectOfferByTasker,
    markTaskAsCompletedByTasker
} = require("../controller/offer");
const { fetchSupportBanks, withdrawalRequest } = require("../controller/wallet");
const router = express.Router();

router.route("/register").post(register)
router.route("/login").post(login);
router.route("/fetch-supported-banks").get([isLoggin], fetchSupportBanks);
router.route("/wallet-withdrawal").post([isLoggin, isVerified, checkUserPin], withdrawalRequest);
router.route("/task/:taskId").get([isLoggin], getSingleTask);
router.route("/all-tasks").get([isLoggin], getAllTasks);
router.route("/tasker-tasks").get([isLoggin, isVerified], getAllTasksByTasker);
router.route("/accept-offer/:offerId").post([isLoggin, isVerified], acceptOfferByTasker);
router.route("/reject-offer/:offerId").post([isLoggin, isVerified], rejectOfferByTasker);
router.route("/mark-task-as-completed/:offerId").post([isLoggin, isVerified], markTaskAsCompletedByTasker);

module.exports = router;