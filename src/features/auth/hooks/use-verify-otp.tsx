// src/features/auth/hooks/use-login.ts
import { useMutation } from '@tanstack/react-query';
import { verifyOtpRequest } from '@/features/auth/api/auth-api';
import { useAuthStore } from '@/features/auth/store/use-auth-store';
import type { VerifyOtpPayload } from '@/features/auth/types';

import { useQueryClient } from '@tanstack/react-query';

export const useOtpVerify = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => verifyOtpRequest(payload),
    
    onSuccess: (data) => {
      // Ab final token mil gaya → login kar do
      setAuth(data.token, data.user);

      // Cache clear kar do (ab zarurat nahi)
      queryClient.removeQueries({ queryKey: ['login-temp-data'] });
    },
  });
};
