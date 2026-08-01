import { apiFetch } from './api.js';

export const studentService = {
  // Get list of all faculty members
  getFaculties: async () => {
    return await apiFetch('/student/faculties', {
      method: 'GET',
    });
  },

  // Submit feedback
  submitFeedback: async (feedbackData) => {
    return await apiFetch('/student/feedback', {
      method: 'POST',
      body: feedbackData,
    });
  },

  // Get student's review history
  getFeedbackHistory: async () => {
    return await apiFetch('/student/history', {
      method: 'GET',
    });
  },

  // Get announcements for student
  getAnnouncements: async () => {
    return await apiFetch('/student/announcements', {
      method: 'GET',
    });
  },
};
