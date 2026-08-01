import { apiFetch } from './api.js';

export const facultyService = {
  // 1. Research Papers API CRUD Callers
  getResearchPapers: async () => {
    return await apiFetch('/faculty/research-papers', { method: 'GET' });
  },
  createResearchPaper: async (data) => {
    return await apiFetch('/faculty/research-papers', {
      method: 'POST',
      body: data,
    });
  },
  updateResearchPaper: async (id, data) => {
    return await apiFetch(`/faculty/research-papers/${id}`, {
      method: 'PUT',
      body: data,
    });
  },
  deleteResearchPaper: async (id) => {
    return await apiFetch(`/faculty/research-papers/${id}`, {
      method: 'DELETE',
    });
  },

  // 2. Books Published API CRUD Callers
  getBooks: async () => {
    return await apiFetch('/faculty/books', { method: 'GET' });
  },
  createBook: async (data) => {
    return await apiFetch('/faculty/books', {
      method: 'POST',
      body: data,
    });
  },
  updateBook: async (id, data) => {
    return await apiFetch(`/faculty/books/${id}`, {
      method: 'PUT',
      body: data,
    });
  },
  deleteBook: async (id) => {
    return await apiFetch(`/faculty/books/${id}`, {
      method: 'DELETE',
    });
  },

  // 3. Certificates API CRUD Callers
  getCertificates: async () => {
    return await apiFetch('/faculty/certificates', { method: 'GET' });
  },
  createCertificate: async (data) => {
    return await apiFetch('/faculty/certificates', {
      method: 'POST',
      body: data,
    });
  },
  updateCertificate: async (id, data) => {
    return await apiFetch(`/faculty/certificates/${id}`, {
      method: 'PUT',
      body: data,
    });
  },
  deleteCertificate: async (id) => {
    return await apiFetch(`/faculty/certificates/${id}`, {
      method: 'DELETE',
    });
  },

  // 4. Events Organised API CRUD Callers
  getEvents: async () => {
    return await apiFetch('/faculty/events', { method: 'GET' });
  },
  createEvent: async (data) => {
    return await apiFetch('/faculty/events', {
      method: 'POST',
      body: data,
    });
  },
  updateEvent: async (id, data) => {
    return await apiFetch(`/faculty/events/${id}`, {
      method: 'PUT',
      body: data,
    });
  },
  deleteEvent: async (id) => {
    return await apiFetch(`/faculty/events/${id}`, {
      method: 'DELETE',
    });
  },

  // 5. KPI Metric API
  getKPI: async () => {
    return await apiFetch('/faculty/kpi', { method: 'GET' });
  },

  // 6. AI Insights Engine API
  getAIInsights: async () => {
    return await apiFetch('/faculty/ai-insights', { method: 'GET' });
  },
};
