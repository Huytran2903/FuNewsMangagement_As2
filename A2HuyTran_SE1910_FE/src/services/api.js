import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically add JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      // Only clear if on protected pages
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname === '/') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
};

// Public APIs (No authentication required)
export const publicService = {
  getNews: (search = '') => api.get(`/public/news${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getNewsDetail: (id) => api.get(`/public/news/${id}`),
  getCategories: () => api.get('/public/categories'),
};

// Account APIs (Admin only)
export const accountService = {
  getAll: (search = '') => api.get(`/accounts${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getById: (id) => api.get(`/accounts/${id}`),
  create: (data) => api.post('/accounts', data),
  update: (id, data) => api.put(`/accounts/${id}`, data),
  delete: (id) => api.delete(`/accounts/${id}`),
};

// Category APIs (Staff only)
export const categoryService = {
  getAll: (search = '') => api.get(`/categories${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Tag APIs (Staff only)
export const tagService = {
  getAll: (search = '') => api.get(`/tags${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getById: (id) => api.get(`/tags/${id}`),
  create: (data) => api.post('/tags', data),
  update: (id, data) => api.put(`/tags/${id}`, data),
  delete: (id) => api.delete(`/tags/${id}`),
};

// News Article APIs (Staff only)
export const newsService = {
  getAll: (search = '') => api.get(`/news${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getById: (id) => api.get(`/news/${id}`),
  getMyHistory: () => api.get('/news/my-history'),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`),
};

// Profile APIs
export const profileService = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
};

export default api;
