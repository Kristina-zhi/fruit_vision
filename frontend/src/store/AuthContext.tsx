import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/client';

interface AuthContextType {
  token: string | null;
  userId: number | null;
  email: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => { loadStoredAuth(); }, []);

  async function loadStoredAuth() {
    const t = await AsyncStorage.getItem('access_token');
    const u = await AsyncStorage.getItem('user_id');
    const e = await AsyncStorage.getItem('email');
    if (t) { setToken(t); setUserId(u ? Number(u) : null); setEmail(e); }
  }

  async function login(email: string, password: string) {
    const r = await api.auth.login(email, password);
    await AsyncStorage.multiSet([['access_token', r.access_token], ['refresh_token', r.refresh_token], ['user_id', String(r.user_id)], ['email', r.email]]);
    setToken(r.access_token); setUserId(r.user_id); setEmail(r.email);
  }

  async function register(email: string, password: string) {
    const r = await api.auth.register(email, password);
    await AsyncStorage.multiSet([['access_token', r.access_token], ['refresh_token', r.refresh_token], ['user_id', String(r.user_id)], ['email', r.email]]);
    setToken(r.access_token); setUserId(r.user_id); setEmail(r.email);
  }

  async function logout() {
    await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user_id', 'email']);
    setToken(null); setUserId(null); setEmail(null);
  }

  return (
    <AuthContext.Provider value={{ token, userId, email, isAuthenticated: !!token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
