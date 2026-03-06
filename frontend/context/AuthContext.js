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
      const payload = await apiRequest('/auth/me', {
        token: authToken
      });

      setUser(payload.user || null);
      return payload.user || null;
    } catch {
      localStorage.removeItem('mda_token');
      setToken(null);
      setUser(null);
      return null;
    }
  }, [token]);

  const login = useCallback(async ({ email, password }) => {
    const payload = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password }
    });

    localStorage.setItem('mda_token', payload.token);
    setToken(payload.token);
    setUser(payload.user || null);

    return payload.user;
  }, []);

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
    () => ({ user, token, loading, login, logout, fetchCurrentUser }),
    [user, token, loading, login, logout, fetchCurrentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
