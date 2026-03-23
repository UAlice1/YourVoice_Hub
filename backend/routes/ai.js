// routes/ai.js  — full corrected example
const express = require('express');
const router = express.Router();

const { chat } = require('../controllers/aiController');  // ← correct relative path

// Your POST /chat route (this should be around line 10)
router.post('/chat', chat);

// Optional: add more AI-related routes later
// router.get('/history', getHistory); etc.

module.exports = router;