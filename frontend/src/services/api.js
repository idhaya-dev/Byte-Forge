import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create a custom Axios instance configured for API requests
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle silent token refresh on 401
api.interceptors.response.use(
  (response) => {
    // Return only the data payload for easy consumption by caller
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Auto-refresh session token on 401 if not loading login or refreshing already
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/login' &&
      originalRequest.url !== '/auth/refresh'
    ) {
      originalRequest._retry = true;
      try {
        // Silent token refresh request
        await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        // Retry the original request with the renewed session cookies
        return api(originalRequest);
      } catch (refreshErr) {
        console.error('Session silent refresh failed:', refreshErr);
      }
    }

    const errorMsg = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(errorMsg));
  }
);

/**
 * Reusable Axios-backed wrapper for API calls that matches the previous fetch signature.
 * Ensures compatibility with all existing service implementations.
 */
export const apiFetch = async (endpoint, options = {}) => {
  const method = options.method || 'GET';
  const data = options.body;
  const headers = options.headers;

  try {
    const response = await api({
      url: endpoint,
      method,
      data,
      headers,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
