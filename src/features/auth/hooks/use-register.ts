import { useMutation } from '@tanstack/react-query';
import { registerRequest } from '@/features/auth/api/auth-api';
import { useAuthStore } from '@/features/auth/store/use-auth-store';
import type { RegisterPayload, AuthResponse } from '@/features/auth/types';

export const useRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation<AuthResponse, Error, RegisterPayload>({
    mutationFn: (payload: RegisterPayload) => registerRequest(payload),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
    },
  });
};
