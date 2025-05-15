import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('api/auth/login', { 
      username,
      password
    });
    return response.data;
  },
  
  register: async (userData: { username: string; password: string }) => {
    const response = await api.post('api/auth/register', userData);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('api/auth/users');
    return response.data;
  }
};

export const gameService = {
  startGame: async (): Promise<{
    success: boolean;
    gameId?: number;
    message?: string;
    wordLength?: number;
    currentWord?: string;
  }> => {
    try {
      const response = await api.post('api/games/start');
      return {
        ...response.data,
        success: true
      };
    } catch (error: any) {
      console.error('Error al iniciar el juego:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al iniciar el juego'
      };
    }
  },

  sendAttempt: async (gameId: number, word: string) => {
    const response = await api.post('api/games/attempt', { gameId, word });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('api/games/stats');
    return response.data;
  },

  getTopPlayers: async () => {
    const response = await api.get('api/games/top-players');
    return response.data;
  },

  getMostGuessedWords: async () => {
    const response = await api.get('api/games/most-guessed-words');
    return response.data;
  }
};

export const getUserStats = async () => {
  const [gamesRes, winsRes] = await Promise.all([
    api.get('api/stats/games'),
    api.get('api/stats/wins')
  ]);
  return {
    totalGames: gamesRes.data.totalGames,
    totalWins: winsRes.data.totalWins
  };
};

export const getTopPlayers = async () => {
  const response = await api.get('api/stats/top-users');
  return response.data;
};

export const getPopularWords = async () => {
  const response = await api.get('api/stats/popular-words');
  return response.data;
};

export default api;