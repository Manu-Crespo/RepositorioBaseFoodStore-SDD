import api from './client';
import type { User } from '../../stores/authStore';

// The 'api' instance from client.ts already has the base URL and interceptors configured.

// Register endpoint
interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export async function register(data: RegisterData) {
  const response = await api.post('/api/v1/auth/register', data);
  return response.data;
}

// Login endpoint
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await api.post('/api/v1/auth/login', {
    email,
    password,
  });
  return response.data;
}

// Refresh token endpoint
export async function refreshToken(token: string) {
  const response = await api.post('/api/v1/auth/refresh', {
    refresh_token: token,
  });
  return response.data;
}

// Logout endpoint
export async function logout() {
  const response = await api.post('/api/v1/auth/logout', {});
  return response.data;
}

// Get current user endpoint
export async function getCurrentUser() {
  const response = await api.get('/api/v1/auth/me');
  return response.data;
}

// Get profile endpoint
export async function getProfile() {
  const response = await api.get('/api/v1/auth/profile');
  return response.data;
}

// Update profile endpoint
export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  phone?: string | null;
}

export async function updateProfile(data: ProfileUpdateData) {
  const response = await api.put('/api/v1/auth/profile', data);
  return response.data;
}

// Change password endpoint
export interface PasswordChangeData {
  current_password: string;
  new_password: string;
}

export async function changePassword(data: PasswordChangeData) {
  const response = await api.put('/api/v1/auth/profile/password', data);
  return response.data;
}