// client/src/api/domainApi.js
import axios from 'axios';

const API_URL = '/api/domains';

// Get a single domain by its ID
const getDomain = (domainId) => {
  return axios.get(`${API_URL}/${domainId}`);
};

const domainApi = {
  getDomain,
};

export default domainApi;