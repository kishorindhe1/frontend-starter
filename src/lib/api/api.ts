import client from "./client";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

// ────────────────────────────────────────────────────────────────
// Fully type-safe, zero `any` API client
// ────────────────────────────────────────────────────────────────

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
  status: number;
};

export type ApiClient = {
  get: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ) => Promise<ApiResponse<T>>;

  post: <T = unknown>(
    url: string,
    payload?: unknown,
    config?: AxiosRequestConfig
  ) => Promise<ApiResponse<T>>;

  put: <T = unknown>(
    url: string,
    payload?: unknown,
    config?: AxiosRequestConfig
  ) => Promise<ApiResponse<T>>;

  patch: <T = unknown>(
    url: string,
    payload?: unknown,
    config?: AxiosRequestConfig
  ) => Promise<ApiResponse<T>>;

  delete: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ) => Promise<ApiResponse<T>>;
};

const handleResponse = <T>(res: AxiosResponse<ApiResponse<T>>): ApiResponse<T> =>
  res.data;

/**
 * API client for making HTTP requests with typed responses.
 * 
 * @remarks
 * This client wraps axios HTTP methods and provides a consistent interface
 * for making API calls. All methods return promises that resolve with the
 * response data after being processed by the handleResponse function.
 * 
 * @example
 * ```typescript
 * // GET request
 * const users = await api.get<User[]>('/users');
 * 
 * // POST request
 * const newUser = await api.post<User>('/users', { name: 'John' });
 * 
 * // PUT request
 * const updatedUser = await api.put<User>('/users/1', { name: 'Jane' });
 * 
 * // PATCH request
 * const patchedUser = await api.patch<User>('/users/1', { email: 'jane@example.com' });
 * 
 * // DELETE request
 * await api.delete('/users/1');
 * ```
 */
const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    client.get<ApiResponse<T>>(url, config).then(handleResponse),

  post: <T = unknown>(url: string, payload?: unknown, config?: AxiosRequestConfig) =>
    client.post<ApiResponse<T>>(url, payload, config).then(handleResponse),

  put: <T = unknown>(url: string, payload?: unknown, config?: AxiosRequestConfig) =>
    client.put<ApiResponse<T>>(url, payload, config).then(handleResponse),

  patch: <T = unknown>(url: string, payload?: unknown, config?: AxiosRequestConfig) =>
    client.patch<ApiResponse<T>>(url, payload, config).then(handleResponse),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    client.delete<ApiResponse<T>>(url, config).then(handleResponse),
} satisfies ApiClient;

export default api;