import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import { setUser as setMonitoringUser, clearUser as clearMonitoringUser } from '../utils/monitoring';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get CSRF token first
        await api.get('/csrf/');
        // Then check if user is authenticated
        const response = await api.get('/auth/user/');
        setUser(response.data);
      } catch (error) {
        // Don't check auth on initial load for production
        // User will need to login explicitly
        console.log('Auth check failed:', error.response?.status);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Only check auth in development or if we have a session
    if (import.meta.env.DEV || document.cookie.includes('sessionid')) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      // Get CSRF token first
      console.log('Getting CSRF token...');
      await api.get('/csrf/');
      console.log('CSRF token obtained, attempting login...');
      
      const response = await api.post('/auth/login/', { username, password });
      console.log('Login successful:', response.data);
      
      setUser(response.data.user);
      // Track user in monitoring
      setMonitoringUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  };

  const signup = async (username, email, password) => {
    try {
      // Get CSRF token first
      console.log('Getting CSRF token for signup...');
      await api.get('/csrf/');
      console.log('CSRF token obtained, attempting signup...');
      
      const response = await api.post('/auth/signup/', { username, email, password });
      console.log('Signup successful:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    await api.post('/auth/logout/');
    setUser(null);
    // Clear user from monitoring
    clearMonitoringUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
