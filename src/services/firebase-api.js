import axios from 'axios';
import { auth } from '../config/firebase';

// Create axios instance with base URL pointing to backend
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Firebase token to requests
API.interceptors.request.use(async (config) => {
  try {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return config;
});

// Handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - user will be logged out by AuthContext
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── AUTH ENDPOINTS ─────────────────────────────────────────────────────────

export const authAPI = {
  // Verify Firebase token with backend
  verifyToken: (token) => API.post('/auth/verify', { token }),
  // Get user profile
  getProfile: () => API.get('/auth/profile'),
};

// ─── USER ENDPOINTS ─────────────────────────────────────────────────────────

export const userAPI = {
  getAllUsers: () => API.get('/users'),
  getUser: (id) => API.get(`/users/${id}`),
  updateUser: (id, data) => API.put(`/users/${id}`, data),
  deleteUser: (id) => API.delete(`/users/${id}`),
};

// ─── PRODUCTS ENDPOINTS (For future use) ────────────────────────────────────

export const productAPI = {
  getAllProducts: () => API.get('/products'),
  getProduct: (id) => API.get(`/products/${id}`),
  createProduct: (data) => API.post('/products', data),
  updateProduct: (id, data) => API.put(`/products/${id}`, data),
  deleteProduct: (id) => API.delete(`/products/${id}`),
};

// ─── HEALTH CHECK ───────────────────────────────────────────────────────────

export const checkBackendHealth = () => API.get('/health');

export default API;
