import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("Hynk_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A 401 anywhere means the token is missing/invalid/expired - clear local
// auth state so the UI falls back to a logged-out view. AuthContext listens
// for this event to also reset its own state without a page reload.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("Hynk_token");
      localStorage.removeItem("Hynk_user");
      window.dispatchEvent(new Event("Hynk:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default api;

/**
 * Pulls a readable message out of an Axios error, falling back to a
 * generic message so the UI never shows "undefined".
 */
export function getErrorMessage(err) {
  return err?.response?.data?.message || err?.message || "Something went wrong. Please try again.";
}
