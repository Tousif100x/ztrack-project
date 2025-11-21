// server/models/Course.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // Link to the User who created it (faculty)
  facultyId: {
    type: Schema.Types.ObjectId, // This is how you store a link
    ref: 'User', // Refers to our 'User' model
    required: true,
  },
  // Link to the Domain it belongs to
  domainId: {
    type: Schema.Types.ObjectId,
    ref: 'Domain', // Refers to our 'Domain' model
    required: true,
  },
  // We will add modules here later
  date: {
    type: Date,
    default: Date.now,
  },
});



module.exports = mongoose.model('Course', CourseSchema);