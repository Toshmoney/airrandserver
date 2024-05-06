const express = require("express");
const { register, login } = require("../controller/auth");
const router = express.Router();

router.route("/register", register)
router.route("/login", login);

module.exports = router;