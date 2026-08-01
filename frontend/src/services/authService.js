import { apiFetch } from './api.js';

export const authService = {
  login: async (email, password) => {
    return await apiFetch('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  register: async (userData) => {
    return await apiFetch('/auth/register', {
      method: 'POST',
      body: userData,
    });
  },

  registerStudent: async (studentData) => {
    return await apiFetch('/auth/register/student', {
      method: 'POST',
      body: studentData,
    });
  },

  logout: async () => {
    return await apiFetch('/auth/logout', {
      method: 'POST',
    });
  },

  getCurrentUser: async () => {
    return await apiFetch('/auth/me', {
      method: 'GET',
    });
  },
};
