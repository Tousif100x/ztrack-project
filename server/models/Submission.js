// server/models/Submission.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubmissionSchema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  moduleId: {
    type: Schema.Types.ObjectId,
    ref: 'Module',
    required: true,
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // URL of the student's uploaded file
  fileUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['submitted', 'graded'],
    default: 'submitted',
  },
  grade: {
    type: String, // e.g., "Pass", "Fail", or a number
    default: 'Pending',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Submission', SubmissionSchema);