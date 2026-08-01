import { apiFetch } from './api.js';

export const appraisalService = {
  getAppraisals: async () => {
    return await apiFetch('/appraisals', {
      method: 'GET',
    });
  },

  getAppraisalById: async (id) => {
    return await apiFetch(`/appraisals/${id}`, {
      method: 'GET',
    });
  },

  submitSelfAppraisal: async (appraisalData) => {
    return await apiFetch('/appraisals/self', {
      method: 'POST',
      body: appraisalData,
    });
  },

  submitHODEvaluation: async (id, hodData) => {
    return await apiFetch(`/appraisals/${id}/hod-eval`, {
      method: 'POST',
      body: hodData,
    });
  },

  submitPeerEvaluation: async (id, peerData) => {
    return await apiFetch(`/appraisals/${id}/peer-eval`, {
      method: 'POST',
      body: peerData,
    });
  },
};
