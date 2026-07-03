import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5291/api', // HTTP port from Rogue-Kie.BE
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
    return Promise.reject(error);
  }
);

export default axiosClient;
