const express = require("express");
const { register, login } = require("../controller/auth");
const { isAdmin } = require("../middleware/authentication");
const updateAccountStatus = require("../middleware/authorization");
const { deleteTaskByAdmin } = require("../controller/task");

const router = express.Router();

router.route("/update-userstatus", [isAdmin], updateAccountStatus)
router.route("/delete-task", [isAdmin], deleteTaskByAdmin)

module.exports = router;