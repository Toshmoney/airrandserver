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

router.route("/register", register)
router.route("/login", login);
router.route("/create-task", [isLoggin, isVerified], createTask);
router.route("/:taskId", [isLoggin], getSingleTask);
router.route("/all-tasks", [isLoggin], getAllTasks);
router.route("/client-tasks:taskId", [isLoggin], getAllTasksByClient);
router.route("/tasker-tasks:taskId", [isLoggin], getAllTasksByTasker);

module.exports = router;