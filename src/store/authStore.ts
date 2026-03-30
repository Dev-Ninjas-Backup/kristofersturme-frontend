import { create } from 'zustand';
import type { User } from '@/types';
import { currentUser } from '@/data/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (data: { email: string; password: string; first_name: string; last_name: string }) => boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email: string, _password: string) => {
    if (email) {
      const isAdmin = email.includes('admin');
      set({
        user: { ...currentUser, email, role: isAdmin ? 'admin' : 'member' },
        isAuthenticated: true,
      });
      return true;
    }
    return false;
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  register: () => {
    return true;
  },
}));
