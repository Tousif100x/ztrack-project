// server/controllers/courseController.js

const Course = require('../models/Course');
const Domain = require('../models/Domain');
const Module = require('../models/Module');

// @desc    Faculty creates a new course
// @access  Private (Faculty only)
exports.createCourse = async (req, res) => {
  try {
    // 1. Check if user is a faculty member
    //    (req.user is from our authMiddleware)
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ msg: 'Access denied. Must be faculty.' });
    }

    // 2. Get data from the request
    // We get domainId from the URL (e.g., /api/courses/domain/605d...)
    const { title, description } = req.body;
    const { domainId } = req.params;

    // 3. (Optional) Check if the domainId is valid
    const domain = await Domain.findById(domainId);
    if (!domain) {
      return res.status(404).json({ msg: 'Domain not found' });
    }

    // 4. Create the new course
    const newCourse = new Course({
      title,
      description,
      domainId: domainId,     // The ID from the URL
      facultyId: req.user.id, // The ID of the logged-in faculty
    });

    // 5. Save to database
    const course = await newCourse.save();

    res.status(201).json(course); // 201 = Created
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// ... (your createCourse function is up here) ...

// @desc    Get all courses for a specific domain
// @access  Public
exports.getCoursesByDomain = async (req, res) => {
  try {
    // 1. Get the domainId from the URL
    const { domainId } = req.params;

    // 2. Find all courses that match the domainId
    const courses = await Course.find({ domainId: domainId })
      .populate('facultyId', 'name email'); // <-- IMPORTANT

    // 3. Send the list of courses
    res.json(courses);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// ... your createCourse and getCoursesByDomain functions are up here ...

// @desc    Get all courses for a specific faculty in a specific domain
// @access  Private (Faculty)
exports.getFacultyCoursesInDomain = async (req, res) => {
  try {
    // 1. Check if user is a faculty member
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ msg: 'Access denied. Must be faculty.' });
    }

    // 2. Get domainId from URL and facultyId from middleware
    const { domainId } = req.params;
    const facultyId = req.user.id;

    // 3. Find all courses that match BOTH facultyId and domainId
    const courses = await Course.find({ 
      facultyId: facultyId, 
      domainId: domainId 
    });

    res.json(courses);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// @desc    Delete a course
// @access  Private (Faculty)
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // 1. Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // 2. Check if faculty owns the course
    if (course.facultyId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'You do not own this course.' });
    }

    // 3. Delete all associated modules from database
    await Module.deleteMany({ courseId: courseId });

    // 4. (Optional but good) Delete files from Cloudinary
    // This is more complex, for now we'll skip to get it working.
    // You can add this later.

    // 5. Delete the course itself
    await course.deleteOne();

    res.json({ msg: 'Course and associated modules removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};