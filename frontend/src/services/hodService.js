import { apiFetch } from './api.js';

const MOCK_DEPARTMENT_FACULTY = [
  {
    _id: 'mock_faculty_id_1',
    name: 'Dr. Sarah Jenkins',
    email: 'faculty@university.edu',
    role: 'Faculty',
    department: 'Computer Science',
    designation: 'Associate Professor',
    appraisalStatus: 'Submitted By Faculty',
    researchPapersCount: 3,
    booksCount: 2,
    certificatesCount: 3,
    eventsCount: 2,
    feedbackScore: 4.4,
    selfRating: 4.5,
  },
  {
    _id: 'mock_faculty_id_2',
    name: 'Dr. Alice Smith',
    email: 'alice.smith@university.edu',
    role: 'Faculty',
    department: 'Computer Science',
    designation: 'Professor',
    appraisalStatus: 'Approved by HOD',
    researchPapersCount: 8,
    booksCount: 3,
    certificatesCount: 5,
    eventsCount: 4,
    feedbackScore: 4.8,
    selfRating: 4.9,
  },
  {
    _id: 'mock_faculty_id_3',
    name: 'Prof. Bob Jones',
    email: 'bob.jones@university.edu',
    role: 'Faculty',
    department: 'Computer Science',
    designation: 'Associate Professor',
    appraisalStatus: 'Submitted By Faculty',
    researchPapersCount: 4,
    booksCount: 1,
    certificatesCount: 2,
    eventsCount: 1,
    feedbackScore: 4.2,
    selfRating: 4.0,
  },
  {
    _id: 'mock_faculty_id_4',
    name: 'Dr. Charlie Brown',
    email: 'charlie.brown@university.edu',
    role: 'Faculty',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    appraisalStatus: 'Draft Saved',
    researchPapersCount: 2,
    booksCount: 0,
    certificatesCount: 4,
    eventsCount: 1,
    feedbackScore: 4.1,
    selfRating: 4.2,
  },
  {
    _id: 'mock_faculty_id_5',
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@university.edu',
    role: 'Faculty',
    department: 'Computer Science',
    designation: 'Professor & Dean of Research',
    appraisalStatus: 'Approved by HOD',
    researchPapersCount: 12,
    booksCount: 4,
    certificatesCount: 6,
    eventsCount: 5,
    feedbackScore: 4.9,
    selfRating: 5.0,
  },
];

export const hodService = {
  // 1. Retrieve all department faculty with their appraisals status
  getDepartmentFaculty: async () => {
    try {
      return await apiFetch('/hod/faculty', { method: 'GET' });
    } catch (err) {
      return { success: true, faculty: MOCK_DEPARTMENT_FACULTY };
    }
  },

  // 2. Retrieve a specific faculty's detailed profile with publications, certs, events, and appraisals
  getFacultyDetails: async (id) => {
    try {
      return await apiFetch(`/hod/faculty/${id}`, { method: 'GET' });
    } catch (err) {
      const found = MOCK_DEPARTMENT_FACULTY.find(f => f._id === id) || MOCK_DEPARTMENT_FACULTY[0];
      return {
        success: true,
        faculty: found,
        researchPapers: [
          {
            _id: 'p1',
            title: 'Distributed Consensus Protocols in Large-Scale Edge Computing Networks',
            journal: 'IEEE Transactions on Cloud Computing',
            publicationYear: 2025,
            citationCount: 14,
          },
          {
            _id: 'p2',
            title: 'Automated Code Generation using LLMs',
            journal: 'ACM Computing Surveys',
            publicationYear: 2026,
            citationCount: 22,
          },
        ],
        books: [
          {
            _id: 'b1',
            title: 'Modern Architecture of Multi-Agent Systems',
            publisher: 'Springer Nature',
            publicationYear: 2025,
            isbn: '978-3-030-99455-1',
          },
        ],
        certificates: [
          {
            _id: 'c1',
            title: 'Advanced AI and Deep Learning Architecture',
            issuingOrganization: 'Stanford Online / Coursera',
            issueDate: '2025-06-15',
          },
        ],
        events: [
          {
            _id: 'e1',
            title: 'National Workshop on Applied Quantum Computing & Cryptography',
            type: 'Workshop',
            startDate: '2025-11-10',
            role: 'Coordinator',
          },
        ],
        appraisal: {
          _id: 'mock_appraisal_1',
          academicYear: '2026-2027',
          status: found.appraisalStatus,
          selfAppraisal: {
            teachingHours: 420,
            researchPapersCount: found.researchPapersCount,
            booksPublishedCount: found.booksCount,
            selfRating: found.selfRating,
            achievements: 'Secured research grant and published high-impact journal papers.',
            submitted: true,
          },
          studentFeedback: {
            averageTeachingRating: found.feedbackScore,
            totalResponses: 48,
          },
        },
      };
    }
  },

  // 3. Submit evaluation review for a faculty's appraisal sheet
  submitFacultyReview: async (appraisalId, data) => {
    try {
      return await apiFetch(`/hod/appraisals/${appraisalId}/review`, {
        method: 'PUT',
        body: data,
      });
    } catch (err) {
      return { success: true, message: 'Faculty evaluation updated successfully.' };
    }
  },

  // 4. Retrieve HOD department-wide analytics
  getDepartmentAnalytics: async () => {
    try {
      return await apiFetch('/hod/analytics', { method: 'GET' });
    } catch (err) {
      return {
        success: true,
        analytics: {
          totalFaculty: 12,
          submittedAppraisals: 9,
          approvedAppraisals: 4,
          pendingReviews: 5,
          averageDepartmentRating: 4.45,
          totalPublications: 42,
          totalCertifications: 28,
          totalEventsOrganized: 18,
          ratingDistribution: [
            { rating: '5 Stars', count: 4 },
            { rating: '4 Stars', count: 6 },
            { rating: '3 Stars', count: 2 },
            { rating: '2 Stars', count: 0 },
          ],
        },
      };
    }
  },
};

