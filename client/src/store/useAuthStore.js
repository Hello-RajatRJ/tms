import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Login action
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post('/auth/login', { email, password });
          if (res.token && res.user) {
            set({
              user: res.user,
              token: res.token,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
            return res.user;
          }
        } catch (err) {
          set({
            error: err.message || 'Login failed. Please check credentials.',
            loading: false,
          });
          throw err;
        }
      },

      // Register action
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post('/auth/register', userData);
          if (res.token && res.user) {
            set({
              user: res.user,
              token: res.token,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
            return res.user;
          }
        } catch (err) {
          set({
            error: err.message || 'Registration failed.',
            loading: false,
          });
          throw err;
        }
      },

      // Logout action
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          loading: false,
        });
      },

      // Check / Refresh current user profile
      checkAuth: async () => {
        const { token } = get();
        if (!token) {
          set({ isAuthenticated: false, user: null, loading: false });
          return;
        }

        try {
          set({ loading: true });
          const res = await api.get('/auth/me');
          if (res.user) {
            set({
              user: res.user,
              isAuthenticated: true,
              loading: false,
            });
          }
        } catch (err) {
          console.warn('Auth token expired or invalid:', err.message);
          get().logout();
        } finally {
          set({ loading: false });
        }
      },

      // Role check helpers
      hasRole: (...roles) => {
        const user = get().user;
        if (!user || !user.role) return false;
        return roles.includes(user.role);
      },

      isAdmin: () => get().user?.role === 'admin',
      canManage: () => ['admin', 'manager'].includes(get().user?.role),
    }),
    {
      name: 'tms-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
