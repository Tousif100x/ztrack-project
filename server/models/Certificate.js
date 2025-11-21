// server/models/Certificate.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CertificateSchema = new Schema({
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
  dateIssued: {
    type: Date,
    default: Date.now,
  },
  // A unique ID for the certificate (e.g., ZTK-12345)
  certificateCode: {
    type: String,
    required: true,
    unique: true,
  },
  // We'll store the URL of the generated PDF here
  url: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Certificate', CertificateSchema);