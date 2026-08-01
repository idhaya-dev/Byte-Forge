import { apiFetch } from './api.js';

export const hodService = {
  // 1. Retrieve all department faculty with their appraisals status
  getDepartmentFaculty: async () => {
    return await apiFetch('/hod/faculty', { method: 'GET' });
  },

  // 2. Retrieve a specific faculty's detailed profile with publications, certs, events, and appraisals
  getFacultyDetails: async (id) => {
    return await apiFetch(`/hod/faculty/${id}`, { method: 'GET' });
  },

  // 3. Submit evaluation review for a faculty's appraisal sheet (or save draft)
  submitFacultyReview: async (appraisalId, data) => {
    return await apiFetch(`/hod/appraisals/${appraisalId}/review`, {
      method: 'PUT',
      body: data
    });
  },

  // 4. Retrieve HOD department-wide analytics
  getDepartmentAnalytics: async () => {
    return await apiFetch('/hod/analytics', { method: 'GET' });
  }
};
