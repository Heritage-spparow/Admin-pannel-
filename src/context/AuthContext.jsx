import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchMe() {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch (e) {
      // 401 simply means the user is not logged in
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

useEffect(() => {
  if (location.pathname === "/login") {
    setLoading(false);
    return;
  }

  fetchMe();
}, []);
  async function login(email, password, otp) {
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
        otp,
      });

      setUser(data.user);

      return data;
    } catch (e) {
      throw e;
    }
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      // Ignore logout errors
    } finally {
      setUser(null);
      navigate("/login");
    }
  }

  const value = {
    user,
    setUser,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}
