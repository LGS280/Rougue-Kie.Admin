import axios from 'axios';

// Khai báo kiểu dữ liệu dự phòng cho `process.env` để TypeScript không báo lỗi trong môi trường WebVite
declare const process: {
  env: {
    BASE_URL?: string;
  };
};

/**
 * Hàm lấy URL kết nối API Backend động:
 * - Ưu tiên 1: Lấy từ biến môi trường Vite `VITE_API_URL` (nếu có cấu hình trong file .env).
 * - Ưu tiên 2: Kết nối trực tiếp tới Server Cloud Azure chính thức (`https://rougekiebe.azurewebsites.net/api`).
 */
const getBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return 'https://rougekiebe.azurewebsites.net/api';
};

/**
 * Khởi tạo Instance Axios dùng chung cho toàn bộ ứng dụng Web Admin Dashboard.
 */
const axiosClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor Request: Tự động đính kèm Token xác thực JWT vào HTTP Header `Authorization: Bearer <Token>`
 * cho mọi request gửi lên Backend API.
 */
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Interceptor Response: Tự động bắt lỗi HTTP 401 Unauthorized hoặc 403 Forbidden.
 * Nếu Token hết hạn hoặc không đủ quyền, tự động xóa Session và chuyển hướng về màn hình `/login`.
 */
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Dọn dẹp bộ nhớ tạm LocalStorage và điều hướng về trang đăng nhập
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
