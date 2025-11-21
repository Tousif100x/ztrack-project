// server/controllers/moduleController.js

const Module = require('../models/Module');
const Course = require('../models/Course');
const cloudinary = require('cloudinary').v2;
// @desc    Get all modules for a specific course
// @access  Private (Student & Faculty)
exports.getModulesForCourse = async (req, res) => {
  try {
    const modules = await Module.find({ courseId: req.params.courseId });
    res.json(modules);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add a new module to a course
// @access  Private (Faculty)
exports.addModule = async (req, res) => {
  // 1. Check if user is faculty
  if (req.user.role !== 'faculty') {
    return res.status(403).json({ msg: 'Access denied. Must be faculty.' });
  }

  try {
    // 2. Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload a file.' });
    }

    // 3. Get other data from the form
    const { title, contentType } = req.body;
    const { courseId } = req.params;

    // 4. Check if the course exists and belongs to this faculty
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found.' });
    }
    if (course.facultyId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'You do not own this course.' });
    }

    // 5. Create the new module
    const newModule = new Module({
      courseId: courseId,
      title: title,
      contentType: contentType,
      url: req.file.path, // <-- The URL from Cloudinary!
    });

    // 6. Save module to database
    const module = await newModule.save();

    res.status(201).json(module);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
exports.deleteModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    // 1. Find the module
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ msg: 'Module not found' });
    }

    // 2. Check if faculty owns the course this module belongs to
    const course = await Course.findById(module.courseId);
    if (course.facultyId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'You do not own this course.' });
    }

    // 3. Delete file from Cloudinary
    // We need to get the public_id from the URL
    const publicId = module.url.split('/').pop().split('.')[0];
    // We must tell Cloudinary if it's a video or a "raw" file (pdf)
    const resourceType = module.contentType === 'video' ? 'video' : 'raw';

    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });

    // 4. Delete module from database
    await module.deleteOne(); // Use deleteOne()

    res.json({ msg: 'Module removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};