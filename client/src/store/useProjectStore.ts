import { create } from 'zustand';
import api from '../services/api';
import type { Project, ProjectStats } from '../types';

export interface ToastNotification {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface ProjectFilters {
  search: string;
  status: string;
  priority: string;
  category: string;
}

interface ProjectState {
  projects: Project[];
  stats: ProjectStats | null;
  loading: boolean;
  statsLoading: boolean;
  error: string | null;
  toast: ToastNotification | null;
  filters: ProjectFilters;
  setToast: (toast: ToastNotification | null) => void;
  setFilters: (newFilters: Partial<ProjectFilters>) => void;
  fetchProjects: (params?: Record<string, any>) => Promise<void>;
  fetchStats: () => Promise<void>;
  createProject: (projectData: any) => Promise<Project>;
  updateProject: (id: string, projectData: any) => Promise<Project>;
  updateProjectStatus: (id: string, newStatus: string) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
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
      const res = (await api.get('/projects', { params })) as any;
      set({ projects: res.data || [], loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch projects', loading: false });
    }
  },

  // Fetch stats for dashboard
  fetchStats: async () => {
    set({ statsLoading: true });
    try {
      const res = (await api.get('/projects/stats')) as any;
      set({ stats: res.data, statsLoading: false });
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
      set({ statsLoading: false });
    }
  },

  // Create project
  createProject: async (projectData) => {
    try {
      const res = (await api.post('/projects', projectData)) as any;
      set((state) => ({
        projects: [res.data, ...state.projects],
      }));
      get().setToast({ message: `Project '${projectData.title}' created successfully!`, type: 'success' });
      get().fetchStats();
      return res.data;
    } catch (err: any) {
      get().setToast({ message: err.message, type: 'error' });
      throw err;
    }
  },

  // Update project
  updateProject: async (id, projectData) => {
    try {
      const res = (await api.patch(`/projects/${id}`, projectData)) as any;
      set((state) => ({
        projects: state.projects.map((p) => (p._id === id ? res.data : p)),
      }));
      get().setToast({ message: `Project updated successfully!`, type: 'success' });
      get().fetchStats();
      return res.data;
    } catch (err: any) {
      get().setToast({ message: err.message, type: 'error' });
      throw err;
    }
  },

  // Quick status update
  updateProjectStatus: async (id, newStatus) => {
    try {
      const res = (await api.patch(`/projects/${id}`, { status: newStatus })) as any;
      set((state) => ({
        projects: state.projects.map((p) => (p._id === id ? res.data : p)),
      }));
      get().setToast({ message: `Status updated to ${newStatus}!`, type: 'success' });
      get().fetchStats();
      return res.data;
    } catch (err: any) {
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
    } catch (err: any) {
      get().setToast({ message: err.message, type: 'error' });
      throw err;
    }
  },
}));

export default useProjectStore;
