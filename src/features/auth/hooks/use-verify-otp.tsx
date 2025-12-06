import { useMutation } from '@tanstack/react-query';
import { verifyOtpRequest } from '@/features/auth/api/auth-api';
import { useAuthStore } from '@/features/auth/store/use-auth-store';

import { useQueryClient } from '@tanstack/react-query';
import type { TVerifyOtpPayload, TLoginOtpResponse } from '../types';

/**
 * Custom hook for verifying OTP (One-Time Password) during authentication.
 * 
 * @remarks
 * This hook uses React Query's `useMutation` to handle OTP verification requests.
 * On successful verification, it updates the authentication state and cleans up
 * temporary login data from the query cache.
 * 
 * @returns A mutation object from React Query with methods to verify OTP
 * 
 * @example
 * ```tsx
 * const { mutate, isLoading, error } = useOtpVerify();
 * 
 * const handleVerify = (otp: string) => {
 *   mutate({ otp, userId: '123' });
 * };
 * ```
 */
export const useOtpVerify = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TVerifyOtpPayload) => {
      const response = await verifyOtpRequest(payload);
      return response.data as TLoginOtpResponse;
    },
    
    onSuccess: (data:TLoginOtpResponse) => {
      setAuth(data.token, data.id);

      queryClient.removeQueries({ queryKey: ['login-temp-data'] });
    },
  });
};
