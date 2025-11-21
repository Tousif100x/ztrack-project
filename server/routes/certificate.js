// server/routes/certificate.js

const express = require('express');
const router = express.Router();
const { generateCertificate } = require('../controllers/certificateController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/certificates/generate/:courseId
// @desc    Generate a new certificate
// @access  Private
router.post('/generate/:courseId', authMiddleware, generateCertificate);

module.exports = router;