const express = require('express');
const router = express.Router();
const { login, verifyTokenAndGetUser, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/login
router.post('/login', login);

// @route   GET /api/auth/verify
router.get('/verify', protect, verifyTokenAndGetUser);

// @route   POST /api/auth/logout
router.post('/logout', protect, logout);

module.exports = router;
