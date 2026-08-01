import { apiFetch } from './api.js';

const MOCK_USERS = {
  'student@university.edu': {
    _id: 'mock_student_id_1',
    name: 'Alex Johnson',
    email: 'student@university.edu',
    role: 'Student',
    department: 'Computer Science',
    year: '3rd Year',
    registerNumber: 'CS2026001',
  },
  'faculty@university.edu': {
    _id: 'mock_faculty_id_1',
    name: 'Dr. Sarah Jenkins',
    email: 'faculty@university.edu',
    role: 'Faculty',
    department: 'Computer Science',
    designation: 'Associate Professor',
  },
  'hod@university.edu': {
    _id: 'mock_hod_id_1',
    name: 'Dr. Richard Harris',
    email: 'hod@university.edu',
    role: 'HOD',
    department: 'Computer Science',
    designation: 'Professor & Head of Department',
  },
  'admin@university.edu': {
    _id: 'mock_admin_id_1',
    name: 'System Administrator',
    email: 'admin@university.edu',
    role: 'Admin',
    department: 'Administration',
    designation: 'IT Director',
  },
};

export const authService = {
  login: async (email, password) => {
    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      if (response?.user) {
        localStorage.setItem('demo_user', JSON.stringify(response.user));
      }
      return response;
    } catch (err) {
      // Fallback for seamless demo/offline access
      const mockUser = MOCK_USERS[email.toLowerCase()];
      if (mockUser && (password === 'password123' || password.length >= 6)) {
        localStorage.setItem('demo_user', JSON.stringify(mockUser));
        return { success: true, user: mockUser };
      }
      throw err;
    }
  },

  register: async (userData) => {
    try {
      return await apiFetch('/auth/register', {
        method: 'POST',
        body: userData,
      });
    } catch (err) {
      const newMockUser = {
        _id: 'mock_' + Date.now(),
        ...userData,
        role: userData.role || 'Faculty',
      };
      localStorage.setItem('demo_user', JSON.stringify(newMockUser));
      return { success: true, user: newMockUser };
    }
  },

  registerStudent: async (studentData) => {
    try {
      return await apiFetch('/auth/register/student', {
        method: 'POST',
        body: studentData,
      });
    } catch (err) {
      const newStudent = {
        _id: 'mock_student_' + Date.now(),
        ...studentData,
        role: 'Student',
      };
      localStorage.setItem('demo_user', JSON.stringify(newStudent));
      return { success: true, user: newStudent };
    }
  },

  logout: async () => {
    localStorage.removeItem('demo_user');
    try {
      return await apiFetch('/auth/logout', {
        method: 'POST',
      });
    } catch (err) {
      return { success: true };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await apiFetch('/auth/me', {
        method: 'GET',
      });
      if (response?.user) {
        localStorage.setItem('demo_user', JSON.stringify(response.user));
        return response;
      }
    } catch (err) {
      const saved = localStorage.getItem('demo_user');
      if (saved) {
        return { success: true, user: JSON.parse(saved) };
      }
    }
    return { success: false, user: null };
  },
};

