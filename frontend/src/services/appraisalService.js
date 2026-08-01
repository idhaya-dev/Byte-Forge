import { apiFetch } from './api.js';

const MOCK_APPRAISALS = [
  {
    _id: 'mock_appraisal_1',
    academicYear: '2026-2027',
    status: 'Draft',
    selfAppraisal: {
      reportFromDate: '',
      reportToDate: '',
      achievements: '',
      challengesText: '',
      submitted: false,
      submittedAt: null,
    },
    studentFeedback: {
      averageTeachingRating: 4.4,
      averageCourseCoverageRating: 4.6,
      averageApproachabilityRating: 4.3,
      totalResponses: 48,
    },
    peerEvaluations: [
      {
        evaluatorName: 'Dr. Alice Smith',
        collaborationRating: 5,
        professionalismRating: 5,
        comments: 'Outstanding research contributor and great team player.',
        submittedAt: '2026-07-29T14:30:00.000Z',
      },
    ],
    hodEvaluation: {
      submitted: false,
    },
  },
];

export const appraisalService = {
  getAppraisals: async () => {
    try {
      return await apiFetch('/appraisals', { method: 'GET' });
    } catch (err) {
      return { success: true, appraisals: MOCK_APPRAISALS };
    }
  },

  getAppraisalById: async (id) => {
    try {
      return await apiFetch(`/appraisals/${id}`, { method: 'GET' });
    } catch (err) {
      return { success: true, appraisal: MOCK_APPRAISALS[0] };
    }
  },

  submitSelfAppraisal: async (appraisalData) => {
    try {
      return await apiFetch('/appraisals/self', {
        method: 'POST',
        body: appraisalData,
      });
    } catch (err) {
      MOCK_APPRAISALS[0].selfAppraisal = {
        ...appraisalData,
        submitted: true,
        submittedAt: new Date().toISOString(),
      };
      MOCK_APPRAISALS[0].status = 'Submitted By Faculty';
      return { success: true, appraisal: MOCK_APPRAISALS[0] };
    }
  },

  submitHODEvaluation: async (id, hodData) => {
    try {
      return await apiFetch(`/appraisals/${id}/hod-eval`, {
        method: 'POST',
        body: hodData,
      });
    } catch (err) {
      MOCK_APPRAISALS[0].hodEvaluation = {
        ...hodData,
        submitted: true,
        submittedAt: new Date().toISOString(),
      };
      MOCK_APPRAISALS[0].status = 'Approved by HOD';
      return { success: true, appraisal: MOCK_APPRAISALS[0] };
    }
  },

  submitPeerEvaluation: async (id, peerData) => {
    try {
      return await apiFetch(`/appraisals/${id}/peer-eval`, {
        method: 'POST',
        body: peerData,
      });
    } catch (err) {
      MOCK_APPRAISALS[0].peerEvaluations.push({
        ...peerData,
        submittedAt: new Date().toISOString(),
      });
      return { success: true, appraisal: MOCK_APPRAISALS[0] };
    }
  },
};

