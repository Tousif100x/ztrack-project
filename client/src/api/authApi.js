// client/src/api/authApi.js

import axios from 'axios';
const API_URL = '/api/auth';

// --- Token Service ---
// Save token to localStorage
const saveToken = (token) => {
  localStorage.setItem('ztrack-token', token);
};

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('ztrack-token');
};

// Remove token from localStorage
const logout = () => {
  localStorage.removeItem('ztrack-token');
};

// --- API Calls ---
const register = (name, email, password, role) => {
  return axios.post(`${API_URL}/register`, {
    name,
    email,
    password,
    role,
  });
};

const login = (email, password) => {
  return axios.post(`${API_URL}/login`, {
    email,
    password,
  });
};

// --- Auth Header Helper ---
// This function returns the auth header with the token
const authHeader = () => {
  const token = getToken();
  if (token) {
    return { 'x-auth-token': token };
  } else {
    return {};
  }
};

const authApi = {
  saveToken,
  getToken,
  logout,
  register,
  login,
  authHeader, // Export the header function
};

export default authApi;