import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.headers) {
      config.headers['X-Request-Time'] = new Date().toISOString();
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: any) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      if (!isLoginRequest) {
        useAuthStore.getState().logout();
      }
    }

    if (error.response?.data) {
      const data = error.response.data;
      if (data.message) {
        errorMessage = data.message;
      }
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        const fieldDetails = data.errors
          .map((e: any) => (e.field ? `${e.field}: ${e.message}` : e.message))
          .join(', ');
        errorMessage = `${errorMessage} (${fieldDetails})`;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export const checkHealth = () => api.get('/health');
export const getProjects = (params?: Record<string, any>) => api.get('/projects', { params });
export const getProjectStats = () => api.get('/projects/stats');
export const getTeamMembers = (params?: Record<string, any>) => api.get('/team-members', { params });
export const createProject = (data: any) => api.post('/projects', data);

export default api;
