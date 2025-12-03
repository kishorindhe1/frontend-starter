// src/lib/api/client.ts
import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-storage"); // or use store getter
  // parse token out of persisted storage if needed, or have a helper getToken()
  if (token && config.headers) {
    // if token is a plain string:
    // config.headers.Authorization = `Bearer ${token}`;
    // adjust according to how you persist store
  }
  return config;
});

export default client;
