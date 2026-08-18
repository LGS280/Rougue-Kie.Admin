import axios from 'axios';

// Provide a minimal declaration for `process.env` so TypeScript won't error in
// browser projects that don't have Node types. Use an empty string fallback
// if BASE_URL is not defined.
declare const process: {
  env: {
    BASE_URL?: string;
  };
};

const getBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return 'https://rougekiebe.azurewebsites.net/api';
};

const axiosClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors (if needed later for token)
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
