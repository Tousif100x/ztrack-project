// server/models/Module.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModuleSchema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  // Type will be 'video', 'note', or 'assignment'
  contentType: {
    type: String,
    enum: ['video', 'note', 'assignment'],
    required: true,
  },
  // This will store the URL from Cloudinary
  url: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Module', ModuleSchema);