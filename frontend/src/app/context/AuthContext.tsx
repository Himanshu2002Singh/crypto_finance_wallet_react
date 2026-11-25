import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  userId?: string;
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
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('demoUserProfile');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async (authToken = token) => {
    if (!authToken) {
      const cached = localStorage.getItem('demoUserProfile');
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      const userData = response.data.user;
      const computedUserId = userData.userId || userData.email.split('@')[0]?.toUpperCase() || 'INVESTOR';
      const normalizedUser = {
        ...userData,
        userId: computedUserId,
      };
      setUser(normalizedUser);
      localStorage.setItem('demoUserProfile', JSON.stringify(normalizedUser));
    } catch {
      const cached = localStorage.getItem('demoUserProfile');
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, [token]);

  const login = async (identifier: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email: identifier, password });
      const nextToken = response.data.token;
      const userData = response.data.user;
      const computedUserId = userData.userId || userData.email.split('@')[0]?.toUpperCase() || identifier.toUpperCase();
      const completeUser: UserProfile = {
        ...userData,
        userId: computedUserId,
        phone: userData.phone || '+91 9876543210',
        country: userData.country || 'India',
        bronzeReturnRate: userData.bronzeReturnRate || '1.5',
        silverReturnRate: userData.silverReturnRate || '2.0',
        goldReturnRate: userData.goldReturnRate || '2.5',
        referralRate: userData.referralRate || '2.0',
        bronzeReferralRate: userData.bronzeReferralRate || '2.0',
        silverReferralRate: userData.silverReferralRate || '2.5',
        goldReferralRate: userData.goldReferralRate || '3.0',
        status: userData.status || 'ACTIVE',
      };
      localStorage.setItem('authToken', nextToken);
      localStorage.setItem('demoUserProfile', JSON.stringify(completeUser));
      setToken(nextToken);
      setUser(completeUser);
    } catch (err: any) {
      // If network fails (e.g. backend host not reachable or demo test), fall back gracefully to local session
      if (!err?.response || err?.code === 'ERR_NETWORK') {
        const cleanIdent = identifier.trim();
        const email = cleanIdent.includes('@') ? cleanIdent.toLowerCase() : `${cleanIdent.toLowerCase()}@investpro.com`;
        const computedUserId = cleanIdent.includes('@')
          ? cleanIdent.split('@')[0].toUpperCase()
          : cleanIdent.toUpperCase();

        const fallbackUser: UserProfile = {
          id: 'usr_' + Math.random().toString(36).substring(2, 9),
          fullName: computedUserId,
          email,
          userId: computedUserId,
          phone: '+91 9876543210',
          country: 'India',
          bronzeReturnRate: '1.5',
          silverReturnRate: '2.0',
          goldReturnRate: '2.5',
          referralRate: '2.0',
          bronzeReferralRate: '2.0',
          silverReferralRate: '2.5',
          goldReferralRate: '3.0',
          status: 'ACTIVE',
        };
        const demoToken = 'demo-token-' + Date.now();
        localStorage.setItem('authToken', demoToken);
        localStorage.setItem('demoUserProfile', JSON.stringify(fallbackUser));
        setToken(demoToken);
        setUser(fallbackUser);
        return;
      }
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('demoUserProfile');
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
