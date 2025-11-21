// server/models/Enrollment.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EnrollmentSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  progress: {
    type: Number,
    default: 0, // e.g., 0%
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  // --- THIS IS THE NEW FIELD ---
  completedModules: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Module',
    }
  ],
  // ------------------------------
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);