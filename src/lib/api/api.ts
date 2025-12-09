import client from './client';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

// ────────────────────────────────────────────────────────────────
// Fully type-safe, zero `any` API client
// ────────────────────────────────────────────────────────────────

export type TApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
  status: number;
};

export type TApiClient = {
  get: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ) => Promise<TApiResponse<T>>;

  post: <T = unknown>(
    url: string,
    payload?: unknown,
    config?: AxiosRequestConfig
  ) => Promise<TApiResponse<T>>;

  put: <T = unknown>(
    url: string,
    payload?: unknown,
    config?: AxiosRequestConfig
  ) => Promise<TApiResponse<T>>;

  patch: <T = unknown>(
    url: string,
    payload?: unknown,
    config?: AxiosRequestConfig
  ) => Promise<TApiResponse<T>>;

  delete: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ) => Promise<TApiResponse<T>>;
};

const handleResponse = <T>(
  res: AxiosResponse<TApiResponse<T>>
): TApiResponse<T> => res.data;

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
    client.get<TApiResponse<T>>(url, config).then(handleResponse),

  post: <T = unknown>(
    url: string,
    payload?: unknown,
    config?: AxiosRequestConfig
  ) => client.post<TApiResponse<T>>(url, payload, config).then(handleResponse),

  put: <T = unknown>(
    url: string,
    payload?: unknown,
    config?: AxiosRequestConfig
  ) => client.put<TApiResponse<T>>(url, payload, config).then(handleResponse),

  patch: <T = unknown>(
    url: string,
    payload?: unknown,
    config?: AxiosRequestConfig
  ) => client.patch<TApiResponse<T>>(url, payload, config).then(handleResponse),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    client.delete<TApiResponse<T>>(url, config).then(handleResponse),
} satisfies TApiClient;

export default api;
