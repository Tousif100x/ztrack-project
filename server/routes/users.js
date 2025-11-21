// server/routes/users.js

const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/users/me
// @desc    Get current user's profile
// @access  Private

// This is where the magic happens:
// We add authMiddleware as the second argument.
// This route will now run the middleware FIRST.
// If the middleware passes, it will then run getUserProfile.
router.get('/me', authMiddleware, getUserProfile);



module.exports = router;