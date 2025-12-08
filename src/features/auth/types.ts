export type TLoginPayload = {
  email: string;
  password: string;
};
export type TVerifyOtpPayload = {
  sessionToken: string;
  otp: string;
};

export type TLoginOtpResponse = {
  token: string;
  id(token: string, id: string): unknown;
  requiresOTP: true;
  email: string;
  message: string;
  expiresIn: string;
};

export type TLoginResponse = {
  requiresOTP?: boolean;
  token: string;
  email: string;
  sessionToken?: string;
  message: string;
  expiresIn: string;
  };
