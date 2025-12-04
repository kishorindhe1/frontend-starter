// src/features/auth/hooks/use-login.ts
import { useMutation } from '@tanstack/react-query';
import { loginRequest } from '@/features/auth/api/auth-api';
// import { useAuthStore } from '@/features/auth/store/use-auth-store';
import type { LoginPayload } from '@/features/auth/types';

// src/features/auth/hooks/use-login.ts
import { useQueryClient } from '@tanstack/react-query';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['login-temp-data'],  
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
    
onSuccess: (data) => {
  queryClient.setQueryData(['login-temp-data'], data);


},
  });
};