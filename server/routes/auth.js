// server/routes/auth.js

const express = require('express');
const router = express.Router();
// Import both register and login functions
const { registerUser, loginUser } = require('../controllers/authController.js');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Login a user (authenticate)
router.post('/login', loginUser); // <-- ADD THIS LINE

module.exports = router;