import { loginRequest } from "@/features/auth/api/auth-api";
import type { TLoginPayload, TLoginResponse } from "@/features/auth/types";
import type { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Custom hook for handling user login functionality.
 * 
 * This hook uses React Query's `useMutation` to manage the login process,
 * including API requests and caching the response data.
 * 
 * @returns {UseMutationResult<ApiResponse<TLoginResponse>, unknown, TLoginPayload>} 
 * A mutation object that includes:
 * - `mutate`: Function to trigger the login request
 * - `mutateAsync`: Async version of mutate
 * - `data`: The response data from a successful login
 * - `error`: Error object if the mutation fails
 * - `isLoading`: Boolean indicating if the mutation is in progress
 * - `isSuccess`: Boolean indicating if the mutation was successful
 * - `isError`: Boolean indicating if the mutation failed
 * 
 * @example
 * ```typescript
 * const { mutate, isLoading } = useLogin();
 * 
 * const handleLogin = (credentials: TLoginPayload) => {
 *   mutate(credentials, {
 *     onSuccess: (data) => {
 *       console.log('Login successful', data);
 *     }
 *   });
 * };
 * ```
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<TLoginResponse>,               // response type
    unknown,                                   // error type
    TLoginPayload                               // payload type
  >({
    mutationKey: ["login-temp-data"],
    mutationFn: (payload) => loginRequest(payload) as Promise<ApiResponse<TLoginResponse>>,

    onSuccess: (data) => {
      queryClient.setQueryData(["login-temp-data"], data.data);
    },
  });
};
