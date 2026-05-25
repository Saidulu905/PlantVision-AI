import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const profile = await authService.getCurrentUser();
          setUser(profile);
        } catch (error) {
          console.error("Failed to recover user profile from token", error);
          logout();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [token]);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({
        email: data.email,
        name: data.name,
        role: data.role,
      });
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password, role }) => {
    setLoading(true);
    try {
      const data = await authService.register({ name, email, password, role });
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
