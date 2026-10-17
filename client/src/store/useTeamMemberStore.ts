import { create } from 'zustand';
import api from '../services/api';
import type { TeamMember } from '../types';
import type { ToastNotification } from './useProjectStore';

interface TeamMemberState {
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
  toast: ToastNotification | null;
  setToast: (toast: ToastNotification | null) => void;
  fetchTeamMembers: (params?: Record<string, any>) => Promise<void>;
  createTeamMember: (memberData: any) => Promise<TeamMember>;
  updateTeamMember: (id: string, memberData: any) => Promise<TeamMember>;
  deleteTeamMember: (id: string, name?: string) => Promise<void>;
}

export const useTeamMemberStore = create<TeamMemberState>((set, get) => ({
  teamMembers: [],
  loading: false,
  error: null,
  toast: null,

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

  fetchTeamMembers: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = (await api.get('/team-members', { params })) as any;
      set({ teamMembers: res.data || [], loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch team members', loading: false });
    }
  },

  createTeamMember: async (memberData) => {
    try {
      const res = (await api.post('/team-members', memberData)) as any;
      set((state) => ({
        teamMembers: [res.data, ...state.teamMembers],
      }));
      get().setToast({ message: `Team member '${memberData.name}' added successfully!`, type: 'success' });
      return res.data;
    } catch (err: any) {
      get().setToast({ message: err.message, type: 'error' });
      throw err;
    }
  },

  updateTeamMember: async (id, memberData) => {
    try {
      const res = (await api.patch(`/team-members/${id}`, memberData)) as any;
      set((state) => ({
        teamMembers: state.teamMembers.map((m) => (m._id === id ? res.data : m)),
      }));
      get().setToast({ message: `Team member updated successfully!`, type: 'success' });
      return res.data;
    } catch (err: any) {
      get().setToast({ message: err.message, type: 'error' });
      throw err;
    }
  },

  deleteTeamMember: async (id, name = 'Member') => {
    try {
      await api.delete(`/team-members/${id}`);
      set((state) => ({
        teamMembers: state.teamMembers.filter((m) => m._id !== id),
      }));
      get().setToast({ message: `Team member '${name}' removed.`, type: 'info' });
    } catch (err: any) {
      get().setToast({ message: err.message, type: 'error' });
      throw err;
    }
  },
}));

export default useTeamMemberStore;
