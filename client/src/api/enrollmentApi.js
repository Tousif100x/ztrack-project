// client/src/api/enrollmentApi.js
import axios from 'axios';
import authApi from './authApi';

const API_URL = '/api/enrollments';

// Enroll in a course (Private)
const enrollInCourse = (courseId) => {
  return axios.post(`${API_URL}/enroll/${courseId}`, null, {
    headers: authApi.authHeader(),
  });
};

// --- NEW FUNCTION ---
// Get enrollment status for a course
const getEnrollmentDetails = (courseId) => {
  return axios.get(`${API_URL}/status/${courseId}`, {
    headers: authApi.authHeader(),
  });
};

// --- NEW FUNCTION ---
// Mark a module as complete
const markModuleComplete = (moduleId) => {
  return axios.post(`${API_URL}/complete-module/${moduleId}`, null, {
    headers: authApi.authHeader(),
  });
};

const enrollmentApi = {
  enrollInCourse,
  getEnrollmentDetails,   // <-- 3. Add to export
  markModuleComplete,     // <-- 3. Add to export
};

export default enrollmentApi;