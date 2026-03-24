import axios from 'axios';
import { auth } from '../config/firebase';

// Create axios instance with base URL pointing to backend
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
API.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      console.error('Error getting Firebase token:', err);
    }
  }
  return config;
});

// Handle errors
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Avoid hard redirecting here so the UI can handle and display 401 errors
    // (like invalid credentials or expired token during auth flows)
    return Promise.reject(error);
  }
);

// ─── AUTH ENDPOINTS ─────────────────────────────────────────────────────────

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
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
  getVendorProducts: () => API.get('/products/mine'),
  getProduct: (id) => API.get(`/products/${id}`),
  createProduct: (data) => API.post('/products', data),
  updateProduct: (id, data) => API.put(`/products/${id}`, data),
  deleteProduct: (id) => API.delete(`/products/${id}`),
};

// ─── HEALTH CHECK ───────────────────────────────────────────────────────────

export const checkBackendHealth = () => API.get('/health');

export default API;
