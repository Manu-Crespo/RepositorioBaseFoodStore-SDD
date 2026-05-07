import axios from 'axios';
import type { User } from '../../stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const authApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for httpOnly cookies
});

// Register endpoint
interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export async function register(data: RegisterData) {
  const response = await authApi.post('/api/v1/auth/register', data);
  return response.data;
}

// Login endpoint
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await authApi.post('/api/v1/auth/login', {
    email,
    password,
  });
  return response.data;
}

// Refresh token endpoint
export async function refreshToken() {
  const response = await authApi.post('/api/v1/auth/refresh', {});
  return response.data;
}

// Logout endpoint
export async function logout() {
  const response = await authApi.post('/api/v1/auth/logout', {});
  return response.data;
}

// Get current user endpoint
export async function getCurrentUser() {
  const response = await authApi.get('/api/v1/auth/me');
  return response.data;
}