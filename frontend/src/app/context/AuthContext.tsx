import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  idProofUrl?: string | null;
  photoUrl?: string | null;
  bronzeReturnRate: string;
  silverReturnRate: string;
  goldReturnRate: string;
  referralRate: string;
  bronzeReferralRate: string;
  silverReferralRate: string;
  goldReferralRate: string;
  status: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async (authToken = token) => {
    if (!authToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const nextToken = response.data.token;
    localStorage.setItem('authToken', nextToken);
    setToken(nextToken);
    await refresh(nextToken);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, isLoading, login, logout, refresh }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
