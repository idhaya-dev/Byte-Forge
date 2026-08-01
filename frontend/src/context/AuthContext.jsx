import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check login status on reload
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Dev Auth Bypass: Retrieve mock session if present
        const mockUserStr = localStorage.getItem('mock_user');
        if (mockUserStr) {
          setUser(JSON.parse(mockUserStr));
          setLoading(false);
          return;
        }

        const response = await authService.getCurrentUser();
        if (response?.success && response?.user) {
          setUser(response.user);
        }
      } catch (err) {
        // User is not logged in, ignore error to prevent annoying logs
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password, defaultRole = 'Student') => {
    setLoading(true);
    setError(null);
    try {
      // Dev Auth Bypass: Automatically determine role and create mock user
      let role = defaultRole;
      const lowerEmail = (email || '').toLowerCase();
      
      if (lowerEmail.includes('faculty')) {
        role = 'Faculty';
      } else if (lowerEmail.includes('hod')) {
        role = 'HOD';
      } else if (lowerEmail.includes('student')) {
        role = 'Student';
      }

      const mockUser = {
        _id: 'mock-user-id-12345',
        name: `Demo ${role}`,
        email: email || `${role.toLowerCase()}@university.edu`,
        role: role,
        department: 'Computer Science',
        designation: role === 'Faculty' ? 'Professor' : undefined,
      };

      setUser(mockUser);
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      return mockUser;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      if (response?.success && response?.user) {
        setUser(response.user);
        return response.user;
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('mock_user');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
