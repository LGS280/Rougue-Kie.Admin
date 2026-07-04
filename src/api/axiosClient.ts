import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://localhost:7075/api', // HTTPS port from Rogue-Kie.BE
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
