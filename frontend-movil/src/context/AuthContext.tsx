import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';

interface User {
  id: string
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          setUser({
            id: tokenData.sub,
            username: tokenData.username
          });
        }
      } catch (error) {
        console.error('Error al verificar el token:', error);
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  const login = async (username: string, password: string) => {
      const data = await authService.login(username, password);
      await AsyncStorage.setItem('token', data.access_token);
      setUser({
        id: data.id,
        username: data.username,
      });
      navigation.navigate('Home');
  };

  const register = async (username: string, password: string) => {
    try {
      await authService.register({ username, password });
      const loginData = await authService.login(username, password);
      await AsyncStorage.setItem('token', loginData.access_token);
      setUser({
        id: loginData.id,
        username: loginData.username,
      });
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error registro:', error);
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
    navigation.navigate('Login');
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