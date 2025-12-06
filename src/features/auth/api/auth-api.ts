import { api } from "@/lib/api";

import type {
      TLoginPayload,
  TLoginOtpResponse,
  TLoginResponse,
  TVerifyOtpPayload
} from "@/features/auth/types";

/**
 * Signs in a user with email and password.
 *
 * @param payload - Login credentials
 * @param payload.email - User's email address
 * @param payload.password - User's password
 *
 * @returns Promise that resolves to the authentication response
 *          - If `requiresOTP: true` → show OTP screen
 *          - If `requiresOTP: false` → user is fully logged in with token
 *
 * @example
 * ```ts
 * const response = await loginRequest({ email: "user@example.com", password: "123456" });
 * if (response.requiresOTP) { ... }
 * ```
 */

export const loginRequest = (payload: TLoginPayload) =>
  api.post<TLoginResponse>("/auth/sign-in", payload);

/** Verify OTP after 2FA login */
/**
 * Verifies an OTP (One-Time Password) by sending a POST request to the authentication endpoint.
 *
 * @param payload - The verification payload containing OTP details
 * @returns A promise that resolves to an AuthResponse containing authentication data
 *
 * @example
 * ```ts
 * const payload = { otp: '123456', identifier: 'user@example.com' };
 * const response = await verifyOtpRequest(payload);
 * ```
 */
export const verifyOtpRequest = (payload: TVerifyOtpPayload) =>
  api.post<TLoginOtpResponse>("/auth/verify-otp", payload);

