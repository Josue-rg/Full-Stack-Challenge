import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);


  const login = async (email: string, password: string) => {
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.access_token);
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
      });
      navigate('/');
    } catch (error) {
      console.error('Error', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const data = await authService.register({ name, email, password });
      localStorage.setItem('token', data.access_token);
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
      });
      navigate('/');
    } catch (error) {
      console.error('Error registro:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('Error useAuth');
  }
  return context;
};
