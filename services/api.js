// API service for connecting to backend with real database
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONSTANTS } from '../utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: APP_CONSTANTS.API_BASE_URL,
  timeout: APP_CONSTANTS.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(APP_CONSTANTS.AUTH_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem(APP_CONSTANTS.AUTH_TOKEN_KEY);
      // Redirect to login (handled in AuthContext)
    }
    return Promise.reject(error);
  }
);

// API methods
const apiService = {
  // Auth endpoints
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  
  // Alumni endpoints
  getAlumni: () => api.get('/alumni'),
  getAlumniGrouped: () => api.get('/alumni/grouped'),
  getAlumniGroupedWithSearch: (searchQuery) => api.get(`/alumni/grouped?search=${searchQuery}`),
  getAlumna: (id) => api.get(`/alumni/${id}`),
  
  // Events endpoints
  getEvents: () => api.get('/events'),
  createEvent: (eventData) => api.post('/events', eventData),
  getEvent: (id) => api.get(`/events/${id}`),
  
  // Batch years endpoints
  getBatchYears: () => api.get('/batch-years'),
};

export default apiService;