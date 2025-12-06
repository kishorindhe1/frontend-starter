export type ApiResponse<T = unknown> = {
  success: boolean;
  status: number;
  message: string;
  data: T;
};