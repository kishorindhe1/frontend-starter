// src/features/auth/types.ts
export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  // add extra user fields as needed
};

export type AuthResponse = {
  token: string;
  refreshToken?: string;
  user: User;
};
