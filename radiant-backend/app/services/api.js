import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

console.log('Initializing API with baseURL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000 
});

api.interceptors.request.use(
  async (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
  },
  
  register: async (name, email, password) => {
    const response = await api.post('/api/auth/register', { name, email, password });
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
  }
};

export const moodService = {
  getAllMoods: async () => {
    const response = await api.get('/api/moods');
    return response.data;
  },
  
  createMood: async (moodData) => {
    const response = await api.post('/api/moods', moodData);
    return response.data;
  }
};

export const fitnessService = {
  getAllActivities: async () => {
    const response = await api.get('/api/fitness');
    return response.data;
  },
  
  createActivity: async (activityData) => {
    const response = await api.post('/api/fitness', activityData);
    return response.data;
  }
};

export const journalService = {
  getAllEntries: async () => {
    const response = await api.get('/api/journals');
    return response.data;
  },
  
  createEntry: async (journalData) => {
    const response = await api.post('/api/journals', journalData);
    return response.data;
  }
};

export const userService = {
  getProfile: async () => {
    const response = await api.get('/api/users/me');
    return response.data;
  },
  
  updateProfile: async (userData) => {
    const response = await api.put('/api/users/me', userData);
    return response.data;
  }
};

export default api;
