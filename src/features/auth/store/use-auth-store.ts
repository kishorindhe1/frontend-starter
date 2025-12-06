import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type TAuthState = {
  token: string | null;
  user: unknown | null;
  setAuth: (token: string, user: unknown) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
};

export const useAuthStore = create<TAuthState>()(
  persist(
    (set,get) => ({
      token: null,
      user: null,
      setAuth: (token:string, user: unknown) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
      isAuthenticated: () => !!(get()?.token),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);



