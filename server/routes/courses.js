// server/routes/courses.js

const express = require('express');
const router = express.Router();
const { 
  createCourse, 
  getCoursesByDomain,
  getFacultyCoursesInDomain,
  deleteCourse // <-- 1. Import new function
} = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/courses/domain/:domainId
router.post('/domain/:domainId', authMiddleware, createCourse);

// GET /api/courses/domain/:domainId
router.get('/domain/:domainId', getCoursesByDomain);

// GET /api/courses/my-courses/:domainId
router.get('/my-courses/:domainId', authMiddleware, getFacultyCoursesInDomain);

// DELETE /api/courses/:courseId
router.delete('/:courseId', authMiddleware, deleteCourse); // <-- 2. Add this route

module.exports = router;