import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

interface User {
  id: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: tokenData.userId,
          username: tokenData.username,
          role: tokenData.role || 'user'
        });
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const data = await authService.login(username, password);
      localStorage.setItem('token', data.access_token);
      const tokenData = JSON.parse(atob(data.access_token.split('.')[1]));
      setUser({
        id: tokenData.userId,
        username: tokenData.username,
        role: tokenData.role || 'user'
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
      const tokenData = JSON.parse(atob(loginData.access_token.split('.')[1]));
      setUser({
        id: tokenData.userId,
        username: tokenData.username,
        role: tokenData.role || 'user'
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

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
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