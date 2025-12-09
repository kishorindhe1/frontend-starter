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

export type TForgotPasswordPayload = {
  email: string;
};

export type TForgotPasswordResponse = {
  message: string;
  // you can extend this if your backend returns more data
};
