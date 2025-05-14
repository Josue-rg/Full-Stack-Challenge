import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
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
    const response = await api.post('api/auth/register', {
      username: userData.username,
      password: userData.password
    });
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get(`${API_URL}/api/auth/users`);
    return response.data;
  }
};

export const getAttemptsService = async () => {
  const response = await api.get('/api/guess/attempts');
  return response.data;
};

export const guessWordService = async (word: string) => {
  const response = await api.post('/api/guess', { word });
  return response.data;
};

export const getUserStats = async (token: string) => {
  const headers = { 'Authorization': `Bearer ${token}` };
  const [gamesRes, winsRes] = await Promise.all([
    api.get('/api/stats/games', { headers }),
    api.get('/api/stats/wins', { headers })
  ]);
  return {
    totalGames: gamesRes.data.totalGames,
    totalWins: winsRes.data.totalWins
  };
};

export const getTopPlayers = async () => {
  const response = await api.get('/api/stats/ranking');
  return response.data;
};

export const getTimeUntilNextWord = async () => {
  const response = await api.get('/api/words/next-word-time');
  return response.data.timeRemaining;
};

export const getPopularWords = async () => {
  const response = await api.get('/api/stats/popular-words');
  return response.data;
};

export default api;
