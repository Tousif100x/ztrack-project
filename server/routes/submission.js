// server/routes/submission.js

const express = require('express');
const router = express.Router();
const {
  submitAssignment,
  getSubmissionsForAssignment,
  gradeSubmission,
  getMySubmissionsForCourse, // <-- 1. Import new function
} = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// POST /api/submissions/:moduleId (Student)
router.post('/:moduleId', authMiddleware, upload.single('file'), submitAssignment);

// GET /api/submissions/:moduleId (Faculty)
router.get('/:moduleId', authMiddleware, getSubmissionsForAssignment);

// POST /api/submissions/grade/:submissionId (Faculty)
router.post('/grade/:submissionId', authMiddleware, gradeSubmission);

// GET /api/submissions/my-submissions/:courseId (Student)
router.get('/my-submissions/:courseId', authMiddleware, getMySubmissionsForCourse); // <-- 2. Add this route

module.exports = router;