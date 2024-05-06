const express = require("express");
const { register, login } = require("../controller/auth");
const { isAdmin } = require("../middleware/authentication");
const updateAccountStatus = require("../middleware/authorization");

const router = express.Router();

router.route("/update-userstatus", [isAdmin], updateAccountStatus)

module.exports = router;