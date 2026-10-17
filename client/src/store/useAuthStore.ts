import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import type { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: { name: string; email: string; password: string; role?: UserRole }) => Promise<User>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  hasRole: (...roles: UserRole[]) => boolean;
  isAdmin: () => boolean;
  canManage: () => boolean;
}

export const useAuthStore = create<AuthState>()(
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
          const res = (await api.post('/auth/login', { email, password })) as any;
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
          throw new Error('Invalid response format');
        } catch (err: any) {
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
          const res = (await api.post('/auth/register', userData)) as any;
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
          throw new Error('Invalid response format');
        } catch (err: any) {
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
          const res = (await api.get('/auth/me')) as any;
          if (res.user) {
            set({
              user: res.user,
              isAuthenticated: true,
              loading: false,
            });
          }
        } catch (err: any) {
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
      canManage: () => {
        const role = get().user?.role;
        return role === 'admin' || role === 'manager';
      },
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
