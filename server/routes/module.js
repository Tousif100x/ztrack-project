// server/routes/module.js

const express = require('express');
const router = express.Router();
const { 
  addModule, 
  getModulesForCourse,
  deleteModule // <-- 1. Import new function
} = require('../controllers/moduleController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// POST /api/modules/:courseId
router.post('/:courseId', authMiddleware, upload.single('file'), addModule);

// GET /api/modules/:courseId
router.get('/:courseId', authMiddleware, getModulesForCourse);

// DELETE /api/modules/:moduleId
router.delete('/:moduleId', authMiddleware, deleteModule); // <-- 2. Add this route

module.exports = router;