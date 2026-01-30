const express = require('express');
const router = express.Router();
const { processCommand } = require('../controllers/chatbotController');
const { protect, adminOnly } = require('../middleware/auth');

// @route   POST /api/chatbot/process
// @desc    Process chatbot command
router.post('/process', protect, adminOnly, processCommand);

module.exports = router;
