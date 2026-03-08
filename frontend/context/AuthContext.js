'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async (nextToken) => {
    const authToken = nextToken || token || localStorage.getItem('mda_token');

    if (!authToken) {
      setUser(null);
      return null;
    }

    try {
      const payload = await apiRequest('/auth/me', { token: authToken });
      setUser(payload.data || null);
      return payload.data || null;
    } catch {
      localStorage.removeItem('mda_token');
      setToken(null);
      setUser(null);
      return null;
    }
  }, [token]);

  const applyAuthPayload = useCallback((payload) => {
    const authData = payload?.data || {};
    if (authData?.token) {
      localStorage.setItem('mda_token', authData.token);
      setToken(authData.token);
    }
    setUser(authData?.user || null);
    return authData?.user || null;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const payload = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password }
    });

    return applyAuthPayload(payload);
  }, [applyAuthPayload]);

  const register = useCallback(async (form) => {
    const payload = await apiRequest('/auth/register', {
      method: 'POST',
      body: form
    });

    return applyAuthPayload(payload);
  }, [applyAuthPayload]);

  const logout = useCallback(() => {
    localStorage.removeItem('mda_token');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('mda_token');

    if (!storedToken) {
      setLoading(false);
      return;
    }

    setToken(storedToken);
    fetchCurrentUser(storedToken).finally(() => setLoading(false));
  }, [fetchCurrentUser]);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, fetchCurrentUser }),
    [user, token, loading, login, register, logout, fetchCurrentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
