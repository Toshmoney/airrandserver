const express = require("express");
const { register, login } = require("../controller/auth");
const {
    createTask,
    getSingleTask,
    getAllTasks,
    getAllTasksByClient,
    getAllTasksByTasker
} = require("../controller/task");
const { isLoggin, isVerified } = require("../middleware/authentication");
const router = express.Router();

router.route("/register").post(register)
router.route("/login").post(login);
router.route("/create-task").post([isLoggin, isVerified], createTask);
router.route("/:taskId").get([isLoggin], getSingleTask);
router.route("/all-tasks").get([isLoggin], getAllTasks);
router.route("/client-tasks:taskId").get([isLoggin], getAllTasksByClient);
router.route("/client-edit-tasks:taskId").get([isLoggin, isVerified], getAllTasksByClient);
router.route("/tasker-tasks:taskId").patch([isLoggin], getAllTasksByTasker);

module.exports = router;