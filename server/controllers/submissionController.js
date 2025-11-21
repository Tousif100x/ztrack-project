// server/controllers/submissionController.js

const Submission = require('../models/Submission');
const Module = require('../models/Module');
const { checkAndUpdateCourseCompletion} = require('../utils/completionHelper')
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // We'll reuse our uploader

// @desc    Student submits an assignment
// @access  Private (Student)
exports.submitAssignment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload a file.' });
    }

    const { moduleId } = req.params;
    const studentId = req.user.id;

    // Get courseId from the module
    const module = await Module.findById(moduleId).select('courseId');
    if (!module) {
      return res.status(404).json({ msg: 'Module not found' });
    }

    // Check if already submitted
    let submission = await Submission.findOne({ moduleId, studentId });
    if (submission) {
      // If they resubmit, update the old one
      submission.fileUrl = req.file.path;
      submission.status = 'submitted';
      submission.grade = 'Pending';
      submission.submittedAt = Date.now();
      await submission.save();
      return res.json(submission);
    }

    // Create new submission
    submission = new Submission({
      courseId: module.courseId,
      moduleId,
      studentId,
      fileUrl: req.file.path,
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Faculty gets all submissions for an assignment
// @access  Private (Faculty)
exports.getSubmissionsForAssignment = async (req, res) => {
  try {
    // We can also add checks to ensure faculty owns the course
    const submissions = await Submission.find({ 
      moduleId: req.params.moduleId 
    }).populate('studentId', 'name email'); // Get student info

    res.json(submissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Faculty grades a submission
// @access  Private (Faculty)
exports.gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade } = req.body; // e.g., "Pass" or "Fail"

    let submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ msg: 'Submission not found' });
    }
    
    // We should also check if faculty owns this course
    
    submission.grade = grade;
    submission.status = 'graded';
    await submission.save();

   if (grade === 'Pass') {
      await checkAndUpdateCourseCompletion(submission.studentId, submission.courseId);
    }

    res.json(submission);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// ... (your other submission functions are up here) ...

// @desc    Get a student's submissions for a specific course
// @access  Private (Student)
exports.getMySubmissionsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const submissions = await Submission.find({ courseId, studentId });
    res.json(submissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};