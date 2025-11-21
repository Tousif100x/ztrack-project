// client/src/api/submissionApi.js
import axios from 'axios';
import authApi from './authApi';

const API_URL = '/api/submissions';

// --- STUDENT ---
const submitAssignment = (moduleId, formData) => {
  return axios.post(`${API_URL}/${moduleId}`, formData, {
    headers: {
      ...authApi.authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
};

// --- NEW FUNCTION (STUDENT) ---
const getMySubmissions = (courseId) => {
  return axios.get(`${API_URL}/my-submissions/${courseId}`, {
    headers: authApi.authHeader(),
  });
};

// --- FACULTY ---
const getSubmissionsForAssignment = (moduleId) => {
  return axios.get(`${API_URL}/${moduleId}`, {
    headers: authApi.authHeader(),
  });
};

const gradeSubmission = (submissionId, grade) => {
  return axios.post(
    `${API_URL}/grade/${submissionId}`,
    { grade },
    { headers: authApi.authHeader() }
  );
};

const submissionApi = {
  submitAssignment,
  getMySubmissions, // <-- Add to export
  getSubmissionsForAssignment,
  gradeSubmission,
};

export default submissionApi;