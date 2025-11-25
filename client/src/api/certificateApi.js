// client/src/api/certificateApi.js
import axios from 'axios';
import authApi from './authApi';

const API_URL = 'https://ztrack-project.onrender.com/api/certificates';

// Generate a certificate (Private)
const generateCertificate = (courseId) => {
  return axios.post(`${API_URL}/generate/${courseId}`, null, {
    headers: authApi.authHeader(),
  });
};

const certificateApi = {
  generateCertificate,
};

export default certificateApi;