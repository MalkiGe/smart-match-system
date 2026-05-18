import axios from "axios";

const api = axios.create({
  // Use VITE_API_URL when set, otherwise use the dev proxy path '/api'
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const baseURL = config.baseURL || api.defaults.baseURL || "";
  const url = config.url || "";
  // Log the proxied request path (e.g. /api/auth/login) to help debugging
  console.log(`API request: ${config.method?.toUpperCase() || "REQUEST"} ${baseURL}${url}`);
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
