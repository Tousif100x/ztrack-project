// client/src/api/moduleApi.js
import axios from 'axios';
import authApi from './authApi';

const API_URL = '/api/modules';

const getModules = (courseId) => {
  return axios.get(`${API_URL}/${courseId}`, {
    headers: authApi.authHeader(),
  });
};

const addModule = (courseId, formData) => {
  return axios.post(`${API_URL}/${courseId}`, formData, {
    headers: {
      ...authApi.authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
};

// --- ADD THIS FUNCTION ---
const deleteModule = (moduleId) => {
  return axios.delete(`${API_URL}/${moduleId}`, {
    headers: authApi.authHeader(),
  });
};

const moduleApi = {
  getModules,
  addModule,
  deleteModule, // <-- Add to export
};

export default moduleApi;