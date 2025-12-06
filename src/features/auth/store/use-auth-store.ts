import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type AuthState = {
  token: string | null;
  user: unknown | null;
  setAuth: (token: string, user: unknown) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
};

export const useAuthStore = create<AuthState>()(
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



// Note: get() helper isn't imported here; instead, read via store hooks in components.
