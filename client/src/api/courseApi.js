// client/src/api/courseApi.js
import axios from 'axios';
import authApi from './authApi';

const API_URL = 'https://ztrack-project.onrender.com/api/courses';

const getCoursesByDomain = (domainId) => {
  // ... (rest of function)
  return axios.get(`${API_URL}/domain/${domainId}`);
};

const getFacultyCourses = (domainId) => {
  // ... (rest of function)
  return axios.get(`${API_URL}/my-courses/${domainId}`, {
    headers: authApi.authHeader(),
  });
};

const createCourse = (domainId, courseData) => {
  // ... (rest of function)
  return axios.post(`${API_URL}/domain/${domainId}`, courseData, {
    headers: authApi.authHeader(),
  });
};

// --- ADD THIS FUNCTION ---
const deleteCourse = (courseId) => {
  return axios.delete(`${API_URL}/${courseId}`, {
    headers: authApi.authHeader(),
  });
};

const courseApi = {
  getCoursesByDomain,
  getFacultyCourses,
  createCourse,
  deleteCourse, // <-- Add to export
};

export default courseApi;