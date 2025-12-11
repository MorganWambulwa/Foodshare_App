import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('foodshare_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user", e);
        localStorage.removeItem('foodshare_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      setUser(data);
      localStorage.setItem('foodshare_user', JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      
      setUser(data);
      localStorage.setItem('foodshare_user', JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message);
      throw error;
    }
  };

  const updateProfile = async (formData) => {
    try {
      const { data } = await api.put('/auth/profile', formData);

      setUser(data);

      localStorage.setItem('foodshare_user', JSON.stringify(data));
      
      return true;
    } catch (error) {
      console.error("Profile update failed:", error.response?.data?.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('foodshare_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateProfile, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);