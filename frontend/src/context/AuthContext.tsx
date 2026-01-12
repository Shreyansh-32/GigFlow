import { createContext, useContext, useState, type ReactNode } from 'react';
import api from '@/lib/axios';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface LoginCredentials {
  email: string;
  password?: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  login: (data: LoginCredentials) => Promise<void>;
  register: (data: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('gigflow_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      setUser(res.data);
      localStorage.setItem('gigflow_user', JSON.stringify(res.data));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterCredentials) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', data);
      setUser(res.data);
      localStorage.setItem('gigflow_user', JSON.stringify(res.data));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout failed", error);
    }
    setUser(null);
    localStorage.removeItem('gigflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};