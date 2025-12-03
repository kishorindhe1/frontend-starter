// src/features/auth/hooks/use-login.ts
import { useMutation } from '@tanstack/react-query';
import { loginRequest } from '@/features/auth/api/auth-api';
import { useAuthStore } from '@/features/auth/store/use-auth-store';
import type { LoginPayload } from '@/features/auth/types';

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
    },
  });
};
