import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract clean error messages and handle 401
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.response?.status === 401) {
      // Don't auto-clear if this was a login attempt failure
      if (!error.config?.url?.includes('/auth/login')) {
        localStorage.removeItem('tms_token');
        localStorage.removeItem('tms_user');
      }
    }

    if (error.response?.data) {
      const data = error.response.data;
      if (data.message) {
        errorMessage = data.message;
      }
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        const fieldErrors = data.errors.map((e) => `${e.field ? `${e.field}: ` : ''}${e.message}`).join(', ');
        errorMessage = `${errorMessage} (${fieldErrors})`;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    return Promise.reject(new Error(errorMessage));
  }
);

// Authentication Endpoints
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Project Endpoints
export const projectService = {
  getAll: (params = {}) => api.get('/projects', { params }),
  getStats: () => api.get('/projects/stats'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (projectData) => api.post('/projects', projectData),
  update: (id, projectData) => api.patch(`/projects/${id}`, projectData),
  delete: (id) => api.delete(`/projects/${id}`),
};

// Team Member Endpoints
export const teamMemberService = {
  getAll: (params = {}) => api.get('/team-members', { params }),
  getById: (id) => api.get(`/team-members/${id}`),
  create: (memberData) => api.post('/team-members', memberData),
  update: (id, memberData) => api.patch(`/team-members/${id}`, memberData),
  delete: (id) => api.delete(`/team-members/${id}`),
};

// Health Check
export const checkHealth = () => api.get('/health');

export default api;
