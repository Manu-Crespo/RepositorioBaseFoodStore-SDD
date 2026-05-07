import axios from 'axios';
import { useAuthStore } from '../../stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token from store
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - try to refresh
      const state = useAuthStore.getState();
      if (typeof state.refreshToken === 'function') {
        // Refresh token and retry
        return state.refreshToken()
          .then(() => {
            // Retry the original request
            const retryConfig = {
              ...error.config,
              headers: {
                ...error.config.headers,
                Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
              },
            };
            return api(retryConfig);
          })
          .catch(() => {
            // Refresh failed - logout
            useAuthStore.getState().logout();
            window.location.href = '/login';
            return Promise.reject(error);
          });
      }
      // No refresh token - logout
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;