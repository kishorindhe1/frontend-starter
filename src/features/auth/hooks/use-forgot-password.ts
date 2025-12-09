// src/features/auth/hooks/use-forgot-password.ts
import { forgotPasswordRequest } from '@/features/auth/api/auth-api';
import type {
  TForgotPasswordPayload,
  TForgotPasswordResponse,
} from '@/features/auth/types';
import type { ApiResponse } from '@/types/api';
import { useMutation } from '@tanstack/react-query';

/**
 * Custom hook for sending a password reset link.
 *
 * This hook uses React Query's `useMutation` to trigger the forgot-password
 * endpoint and handle loading/error states.
 *
 * @returns {UseMutationResult<ApiResponse<TForgotPasswordResponse>, unknown, TForgotPasswordPayload>}
 * A mutation object with:
 * - `mutate` / `mutateAsync` – trigger the request
 * - `isPending` – loading state
 * - `isSuccess` / `isError` – result states
 *
 * @example
 * ```tsx
 * const { mutateAsync, isPending } = useForgotPassword();
 *
 * const handleSubmit = async (data: TForgotPasswordPayload) => {
 *   await mutateAsync(data);
 *   message.success("Reset link sent!");
 * };
 * ```
 */
export const useForgotPassword = () => {
  return useMutation<
    ApiResponse<TForgotPasswordResponse>,
    unknown,
    TForgotPasswordPayload
  >({
    mutationKey: ['forgot-password'],
    mutationFn: payload => forgotPasswordRequest(payload),
  });
};
