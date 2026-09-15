import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loginUser, registerUser, logoutUser } from "../services/authService";
import { getErrorMessage } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("Hynk_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [authLoading, setAuthLoading] = useState(false);

  const persistSession = useCallback((token, userData) => {
    localStorage.setItem("Hynk_token", token);
    localStorage.setItem("Hynk_user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem("Hynk_token");
    localStorage.removeItem("Hynk_user");
    setUser(null);
  }, []);

  // If any API call comes back 401, api.js dispatches this event so we drop
  // out of the logged-in state everywhere at once, without a page reload.
  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener("Hynk:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("Hynk:unauthorized", handleUnauthorized);
  }, []);

  async function login(credentials) {
    setAuthLoading(true);
    try {
      const data = await loginUser(credentials);
      persistSession(data.token, data.user);
      return data;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    } finally {
      setAuthLoading(false);
    }
  }

  async function register(payload) {
    setAuthLoading(true);
    try {
      const data = await registerUser(payload);
      persistSession(data.token, data.user);
      return data;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    } finally {
      setAuthLoading(false);
    }
  }

  async function logout() {
    try {
      await logoutUser();
    } catch {
      // even if the network call fails, still clear local session
    }
    clearSession();
  }

  function updateStoredUser(updatedUser) {
    localStorage.setItem("Hynk_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    authLoading,
    login,
    register,
    logout,
    updateStoredUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
