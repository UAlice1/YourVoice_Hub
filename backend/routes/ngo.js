const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { chat, getChatHistory, getSessionMessages } = require("../controllers/aiController");

router.use(protect);

router.post("/chat", chat);
router.get("/history", getChatHistory);
router.get("/sessions/:session_id", getSessionMessages);

module.exports = router;