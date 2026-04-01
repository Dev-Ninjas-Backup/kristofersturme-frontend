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

const CREDENTIALS = [
  { email: 'admin@membersclub.com', password: 'admin123', role: 'admin' as const },
  { email: 'member@membersclub.com', password: 'member123', role: 'member' as const },
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email: string, password: string) => {
    const match = CREDENTIALS.find(c => c.email === email && c.password === password);
    if (match) {
      set({
        user: { ...currentUser, email: match.email, role: match.role },
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
