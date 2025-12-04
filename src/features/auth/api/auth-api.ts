
import type { AxiosInstance } from "axios";
import { client } from "@/lib/api"; 

import type {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  VerifyOtpPayload
} from "@/features/auth/types";

const api: AxiosInstance = client;

export const loginRequest = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const { data } = await api.post("/v1.0/auth/sign-in", payload);
  return data;
};
export const verifyOtpRequest = async (
  payload: VerifyOtpPayload
): Promise<AuthResponse> => {
  const { data } = await api.post("/v1.0/auth/verify-otp", payload);
  return data;
};
export const registerRequest = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const refreshTokenRequest = async (): Promise<AuthResponse> => {
  const { data } = await api.post("/auth/refresh");
  return data;
};
