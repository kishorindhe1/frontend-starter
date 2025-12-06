import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "@/features/auth/api/auth-api";
import type { TLoginPayload } from "@/features/auth/types";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Custom hook for handling user login functionality.
 * 
 * This hook uses React Query's `useMutation` to manage the login process.
 * On successful login, it caches the login response data in the query client
 * under the key "login-temp-data".
 * 
 * @returns A mutation object containing the login mutation state and methods
 * 
 * @example
 * ```tsx
 * const { mutate: login, isLoading, isError } = useLogin();
 * 
 * const handleLogin = (credentials: TLoginPayload) => {
 *   login(credentials);
 * };
 * ```
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["login-temp-data"],
    mutationFn: (payload: TLoginPayload) => loginRequest(payload),

    onSuccess: (data) => {
      queryClient.setQueryData(["login-temp-data"], data);
    },
  });
};
