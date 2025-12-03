// src/features/auth/api/auth-api.ts
// src/features/auth/api/auth-api.ts
import type { AxiosInstance } from 'axios';
import client from '@/lib/api/client'; // your axios instance

import type { LoginPayload, RegisterPayload, AuthResponse } from '@/features/auth/types';

const api: AxiosInstance = client;

export const loginRequest = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/login', payload);
  return data;
};

export const registerRequest = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};

export const refreshTokenRequest = async (): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/refresh');
  return data;
};
