import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
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


  const login = async (username: string, password: string) => {
    try {
      const data = await authService.login(username, password);
      localStorage.setItem('token', data.access_token);
      setUser({
        id: data.id, // Cambiado de data.user.id
        username: data.username, // Cambiado de data.user.username
      });
      navigate('/');
    } catch (error) {
      console.error('Error', error);
      throw error;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      await authService.register({ username, password });
      const loginData = await authService.login(username, password);
      localStorage.setItem('token', loginData.access_token);
      setUser({
        id: loginData.id,
        username: loginData.username,
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
