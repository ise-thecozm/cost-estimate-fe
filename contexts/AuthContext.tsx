import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface UserInfo {
  username: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: UserInfo | null;
  setToken: (token: string | null, userInfo?: UserInfo) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() => {
    // Try to get token from localStorage on mount
    return localStorage.getItem('auth_token');
  });

  const [user, setUser] = useState<UserInfo | null>(() => {
    // Try to get user info from localStorage on mount
    const storedUser = localStorage.getItem('auth_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Listen for auth storage changes (from interceptor or other sources)
  React.useEffect(() => {
    const handleAuthChange = () => {
      const newToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      setTokenState(newToken);
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    // Listen for custom event from API interceptor
    window.addEventListener('auth-storage-change', handleAuthChange);
    // Also listen for storage events (for cross-tab sync)
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('auth-storage-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const setToken = useCallback((newToken: string | null, userInfo?: UserInfo) => {
    setTokenState(newToken);
    if (newToken && userInfo) {
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('auth_user', JSON.stringify(userInfo));
      setUser(userInfo);
    } else {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setUser(null);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
  }, [setToken]);

  const value: AuthContextType = {
    token,
    user,
    setToken,
    isAuthenticated: !!token,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
