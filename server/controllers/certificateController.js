// server/controllers/certificateController.js

const PDFDocument = require('pdfkit');
const cloudinary = require('cloudinary').v2;
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');

// @desc    Generate a certificate
// @access  Private (Student)
exports.generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // --- NEW SIMPLIFIED LOGIC ---
    // 1. Check if enrollment is officially complete
    const enrollment = await Enrollment.findOne({ studentId, courseId });
    if (!enrollment || !enrollment.isCompleted) {
      return res.status(400).json({ msg: 'Course is not yet complete. Check your assignments and modules.' });
    }
    // --- END NEW LOGIC ---

    // 2. Check if certificate already exists
    let certificate = await Certificate.findOne({ studentId, courseId });
    if (certificate) {
      return res.json({ url: certificate.url });
    }

    // 3. Get User and Course data
    const student = await User.findById(studentId).select('name');
    const course = await Course.findById(courseId).select('title');

    // 4. Create the PDF in memory
    const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
    
    doc.fontSize(30).text('Certificate of Completion', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(20).text('This certificate is proudly presented to', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(40).fillColor('blue').text(student.name, { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(20).fillColor('black').text('for successfully completing the course', { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(30).text(course.title, { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(16).text(`Issued on: ${new Date().toLocaleDateString()}`, { align: 'center' });

    // 5. Upload PDF to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'ztrack-certificates', resource_type: 'raw' },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ msg: 'Cloudinary upload failed' });
        }

        // 6. Create the certificate record in MongoDB
        const certificateCode = `ZTK-${Date.now()}`;
        certificate = new Certificate({
          studentId,
          courseId,
          certificateCode,
          url: result.secure_url,
        });
        await certificate.save();

        // 7. Send the URL back to the user
        res.json({ url: result.secure_url });
      }
    );

    doc.pipe(uploadStream);
    doc.end();

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};