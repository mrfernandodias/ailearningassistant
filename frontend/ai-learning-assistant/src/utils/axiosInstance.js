import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Only redirect to login if NOT already on login/register pages
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes('/login') &&
        !currentPath.includes('/register')
      ) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Handle server errors
    if (error.response?.status === 500) {
      const message =
        error.response.data?.message || 'Server error. Please try again later.';
      console.error('Server Error:', message);
    }

    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout. Please try again.');
    }

    // Handle network errors
    if (error.request && !error.response) {
      console.error('Network error. Check your internet connection.');
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
