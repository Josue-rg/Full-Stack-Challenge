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

export default api;
