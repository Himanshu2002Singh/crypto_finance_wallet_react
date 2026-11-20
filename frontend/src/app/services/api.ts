import axios from 'axios';

// Get API base from environment or fallback
const rawBaseURL = import.meta.env.VITE_API_URL || 'https://www.api.investzora.com';
// Normalize: remove surrounding whitespace, trailing slash, and duplicate /api suffix
const normalizedHost = rawBaseURL.trim().replace(/\/+$/, '').replace(/\/api$/, '');
export const BASE_API_URL = `${normalizedHost}/api`;

export const api = axios.create({
  baseURL: BASE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminApi = axios.create({
  baseURL: BASE_API_URL,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
