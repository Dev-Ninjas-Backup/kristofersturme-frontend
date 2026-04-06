import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserData, setUserData, seedIfEmpty } from '@/lib/db';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: { email: string; password: string; first_name: string; last_name: string }) => Promise<void>;
  _setAuth: (user: User | null, loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  authLoading: true,

  _setAuth: (user, loading) =>
    set({ user, isAuthenticated: !!user, authLoading: loading }),

  login: async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    let userData = await getUserData(cred.user.uid);

    if (!userData) {
      const role = email.toLowerCase().includes('admin') ? 'admin' : 'member';
      userData = { email: cred.user.email!, role, is_active: true };
      await setUserData(cred.user.uid, userData);
    }

    if (userData.role === 'admin') await seedIfEmpty();

    set({
      user: { id: cred.user.uid, email: cred.user.email!, role: userData.role, is_active: userData.is_active },
      isAuthenticated: true,
      authLoading: false,
    });
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, isAuthenticated: false, authLoading: false });
  },

  register: async ({ email, password }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const userData = { email: cred.user.email!, role: 'member' as const, is_active: true };
    await setUserData(cred.user.uid, userData);
    set({
      user: { id: cred.user.uid, email: cred.user.email!, role: 'member', is_active: true },
      isAuthenticated: true,
      authLoading: false,
    });
  },
}));
