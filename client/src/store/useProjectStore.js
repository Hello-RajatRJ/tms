import { create } from 'zustand';
import api from '../services/api';

export const useProjectStore = create((set, get) => ({
  projects: [],
  stats: null,
  loading: false,
  statsLoading: false,
  error: null,
  toast: null,
  filters: {
    search: '',
    status: 'All',
    priority: 'All',
    category: 'All',
  },

  setToast: (toast) => {
    set({ toast });
    if (toast) {
      setTimeout(() => {
        if (get().toast === toast) {
          set({ toast: null });
        }
      }, 4000);
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  // Fetch all projects with query parameters
  fetchProjects: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/projects', { params });
      set({ projects: res.data || [], loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch projects', loading: false });
    }
  },

  // Fetch stats for dashboard
  fetchStats: async () => {
    set({ statsLoading: true });
    try {
      const res = await api.get('/projects/stats');
      set({ stats: res.data, statsLoading: false });
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
      set({ statsLoading: false });
    }
  },

  // Create project
  createProject: async (projectData) => {
    try {
      const res = await api.post('/projects', projectData);
      set((state) => ({
        projects: [res.data, ...state.projects],
      }));
      get().setToast({ message: `Project '${projectData.title}' created successfully!`, type: 'success' });
      // Refresh stats
      get().fetchStats();
      return res.data;
    } catch (err) {
      get().setToast({ message: err.message, type: 'error' });
      throw err;
    }
  },

  // Update project
  updateProject: async (id, projectData) => {
    try {
      const res = await api.patch(`/projects/${id}`, projectData);
      set((state) => ({
        projects: state.projects.map((p) => (p._id === id ? res.data : p)),
      }));
      get().setToast({ message: `Project updated successfully!`, type: 'success' });
      get().fetchStats();
      return res.data;
    } catch (err) {
      get().setToast({ message: err.message, type: 'error' });
      throw err;
    }
  },

  // Quick status update
  updateProjectStatus: async (id, newStatus) => {
    try {
      const res = await api.patch(`/projects/${id}`, { status: newStatus });
      set((state) => ({
        projects: state.projects.map((p) => (p._id === id ? res.data : p)),
      }));
      get().setToast({ message: `Status updated to ${newStatus}!`, type: 'success' });
      get().fetchStats();
      return res.data;
    } catch (err) {
      get().setToast({ message: err.message, type: 'error' });
      throw err;
    }
  },

  // Delete project
  deleteProject: async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== id),
      }));
      get().setToast({ message: 'Project deleted successfully!', type: 'info' });
      get().fetchStats();
    } catch (err) {
      get().setToast({ message: err.message, type: 'error' });
      throw err;
    }
  },
}));

export default useProjectStore;
