import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

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
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    // Get CSRF token first
    await api.get('/csrf/');
    const response = await api.post('/auth/login/', { username, password });
    setUser(response.data.user);
    return response.data;
  };

  const signup = async (username, email, password) => {
    // Get CSRF token first
    await api.get('/csrf/');
    const response = await api.post('/auth/signup/', { username, email, password });
    return response.data;
  };

  const logout = async () => {
    await api.post('/auth/logout/');
    setUser(null);
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
