// src/features/auth/types.ts
export type LoginPayload = {
  email: string;
  password: string;
};
export type VerifyOtpPayload = {
  sessionToken: string;
  otp: string;
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
  token(token: any, user: any): unknown;
  success: boolean;
  status: number;
  message: string;
  data: {
    message: string;
    requiresOTP: boolean;
    email: string;
    otp: string;
    expiresIn: string;
  };
};
