import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchMe() {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email, password, otp) {
    try {
      const { data } = await api.post('/auth/login', { email, password, otp });
      // The backend sets httpOnly cookie; response also includes user data
      // To be safe, call /me again
      await fetchMe();
      return data;
    } catch (e) {
      throw e;
    }
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore
    } finally {
      setUser(null);
      navigate('/login');
    }
  }

  const value = { user, setUser, loading, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
