import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('tms_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('tms_token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Verify token on mount
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('tms_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('tms_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          localStorage.removeItem('tms_token');
          localStorage.removeItem('tms_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await authService.login({ email, password });
      if (res.token && res.user) {
        localStorage.setItem('tms_token', res.token);
        localStorage.setItem('tms_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        return res.user;
      }
    } catch (err) {
      setAuthError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    setAuthError(null);
    try {
      const res = await authService.register(userData);
      if (res.token && res.user) {
        localStorage.setItem('tms_token', res.token);
        localStorage.setItem('tms_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        return res.user;
      }
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('tms_token');
    localStorage.removeItem('tms_user');
    setToken(null);
    setUser(null);
    setAuthError(null);
  }, []);

  // Role checking helpers
  const hasRole = (...roles) => {
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  };

  const isAdmin = user?.role === 'admin';
  const canManage = user?.role === 'admin' || user?.role === 'manager';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        isAuthenticated,
        isAdmin,
        canManage,
        login,
        register,
        logout,
        hasRole,
      }}
    >
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

export default AuthContext;
