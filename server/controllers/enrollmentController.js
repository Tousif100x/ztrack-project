// server/controllers/enrollmentController.js

const Enrollment = require('../models/Enrollment');
const Module = require('../models/Module');
// 1. Import the new master check function
const { checkAndUpdateCourseCompletion } = require('../utils/completionHelper');

// ... (your enrollInCourse function is unchanged) ...
exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;
    let enrollment = await Enrollment.findOne({ studentId, courseId });
    if (enrollment) return res.status(200).json(enrollment);
    enrollment = new Enrollment({ studentId, courseId });
    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ... (your getEnrollmentDetails function is unchanged) ...
exports.getEnrollmentDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;
    const enrollment = await Enrollment.findOne({ studentId, courseId });
    if (!enrollment) {
      return res.status(404).json({ msg: 'You are not enrolled in this course.' });
    }
    res.json(enrollment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// --- THIS FUNCTION IS NOW FIXED ---
// @desc    Mark a module as complete
exports.markModuleComplete = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const studentId = req.user.id;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ msg: 'Module not found' });
    const { courseId } = module;

    const enrollment = await Enrollment.findOne({ studentId, courseId });
    if (!enrollment) return res.status(404).json({ msg: 'Enrollment not found' });

    if (enrollment.completedModules.includes(moduleId)) {
      return res.json(enrollment); // Already done
    }

    enrollment.completedModules.push(moduleId);

    // 2. Recalculate progress (for viewable modules only)
    const totalViewableModules = await Module.countDocuments({ 
      courseId, 
      contentType: { $ne: 'assignment' } 
    });

    if (totalViewableModules > 0) {
      const progress = (enrollment.completedModules.length / totalViewableModules) * 100;
      // We cap progress at 99% if there are assignments.
      // The final 100% is set by the master check.
      const assignmentCount = await Module.countDocuments({ courseId, contentType: 'assignment' });
      if (assignmentCount > 0 && progress === 100) {
        enrollment.progress = 99; // "Almost done"
      } else {
        enrollment.progress = progress;
      }
    }
    
    await enrollment.save();

    // 3. Call the master check function
    await checkAndUpdateCourseCompletion(studentId, courseId);

    // 4. Send back the *most up-to-date* enrollment
    const updatedEnrollment = await Enrollment.findById(enrollment._id);
    res.json(updatedEnrollment);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};