import { isLoggin, isVerified } from "../middleware/authentication";

const express = require ("express");
const { getMessages, sendMessage, getConversations } = require("../controller/message");

const router = express.Router();

router.route("/conversations").get([isLoggin, isVerified], getConversations);
router.route("/:otherUserId").get([isLoggin, isVerified], getMessages)
router.route("/").post([isLoggin, isVerified], sendMessage)

module.exports = router;