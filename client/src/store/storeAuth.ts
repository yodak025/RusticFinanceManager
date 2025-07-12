import { create } from 'zustand';

interface AuthState {
  isActiveSession: boolean;
  logIn: () => void;
  logOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isActiveSession: true,
  logIn: () => set({ isActiveSession: true }),
  logOut: () => set({ isActiveSession: false }),
}));