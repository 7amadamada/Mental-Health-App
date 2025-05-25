import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      AsyncStorage.removeItem('token');
      // Navigation would be handled by the component
    }
    return Promise.reject(error);
  }
);

// Auth services
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
  },
  
  logout: async () => {
    await AsyncStorage.removeItem('token');
  },
  
  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  }
};

// Meditation services
export const meditationService = {
  getAllMeditations: async () => {
    const response = await api.get('/api/meditations');
    return response.data;
  },
  
  getMeditationById: async (id) => {
    const response = await api.get(`/api/meditations/${id}`);
    return response.data;
  }
};

// Mood services
export const moodService = {
  getAllMoods: async () => {
    const response = await api.get('/api/moods');
    return response.data;
  },
  
  createMood: async (moodData) => {
    const response = await api.post('/api/moods', moodData);
    return response.data;
  },
  
  getMoodStats: async (period) => {
    const response = await api.get(`/api/moods/stats?period=${period}`);
    return response.data;
  }
};

// Journal services
export const journalService = {
  getAllJournals: async () => {
    const response = await api.get('/api/journals');
    return response.data;
  },
  
  createJournal: async (journalData) => {
    const response = await api.post('/api/journals', journalData);
    return response.data;
  },
  
  getJournalById: async (id) => {
    const response = await api.get(`/api/journals/${id}`);
    return response.data;
  },
  
  updateJournal: async (id, journalData) => {
    const response = await api.put(`/api/journals/${id}`, journalData);
    return response.data;
  },
  
  deleteJournal: async (id) => {
    const response = await api.delete(`/api/journals/${id}`);
    return response.data;
  }
};

// Fitness services
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

export default api;