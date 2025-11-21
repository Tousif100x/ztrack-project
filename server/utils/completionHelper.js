// server/utils/completionHelper.js

const Enrollment = require('../models/Enrollment');
const Module = require('../models/Module');
const Submission = require('../models/Submission');

const checkAndUpdateCourseCompletion = async (studentId, courseId) => {
  try {
    const enrollment = await Enrollment.findOne({ studentId, courseId });
    if (!enrollment) return; // No enrollment

    const allModules = await Module.find({ courseId });
    if (allModules.length === 0) return; // No modules in course

    const viewableModules = allModules.filter(m => m.contentType !== 'assignment');
    const assignmentModules = allModules.filter(m => m.contentType === 'assignment');

    // 1. Check if all "viewable" modules are complete
    for (const mod of viewableModules) {
      if (!enrollment.completedModules.includes(mod._id)) {
        // Not all viewable modules are done, so we can't be 100%
        return; 
      }
    }

    // 2. Check if all "assignments" are graded as "Pass"
    for (const mod of assignmentModules) {
      const submission = await Submission.findOne({ 
        moduleId: mod._id, 
        studentId: studentId 
      });
      if (!submission || submission.grade !== 'Pass') {
         // Not all assignments are passed, so we can't be 100%
        return;
      }
    }

    // 3. If all checks pass, update the enrollment!
    enrollment.isCompleted = true;
    enrollment.progress = 100;
    await enrollment.save();

  } catch (err) {
    console.error('Error checking completion:', err);
  }
};

module.exports = { checkAndUpdateCourseCompletion };