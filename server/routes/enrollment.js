// server/routes/enrollment.js

const express = require('express');
const router = express.Router();
const { 
  enrollInCourse,
  getEnrollmentDetails,  // <-- 1. Import new function
  markModuleComplete       // <-- 1. Import new function
} = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/enrollments/enroll/:courseId
router.post('/enroll/:courseId', authMiddleware, enrollInCourse);

// @route   GET /api/enrollments/status/:courseId
// @desc    Get enrollment status (progress, completed modules)
router.get('/status/:courseId', authMiddleware, getEnrollmentDetails); // <-- 2. Add this route

// @route   POST /api/enrollments/complete-module/:moduleId
// @desc    Mark a module as complete
router.post('/complete-module/:moduleId', authMiddleware, markModuleComplete); // <-- 2. Add this route

module.exports = router;