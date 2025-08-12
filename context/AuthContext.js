// Authentication context
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/api';
import { APP_CONSTANTS } from '../utils/constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(APP_CONSTANTS.AUTH_TOKEN_KEY);
        if (storedToken) {
          setToken(storedToken);
          
          // Get user data
          const response = await apiService.getMe();
          setUser(response.data.data);
        }
      } catch (error) {
        console.log('Not authenticated');
        await AsyncStorage.removeItem(APP_CONSTANTS.AUTH_TOKEN_KEY);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (login, password) => {
    try {
      const response = await apiService.login({ login, password });
      const { token, data } = response.data;
      
      setToken(token);
      setUser(data);
      
      // Store token
      await AsyncStorage.setItem(APP_CONSTANTS.AUTH_TOKEN_KEY, token);
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await apiService.register({ username, email, password });
      const { token, data } = response.data;
      
      setToken(token);
      setUser(data);
      
      // Store token
      await AsyncStorage.setItem(APP_CONSTANTS.AUTH_TOKEN_KEY, token);
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem(APP_CONSTANTS.AUTH_TOKEN_KEY);
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};