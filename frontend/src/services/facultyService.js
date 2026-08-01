import { apiFetch } from './api.js';

const MOCK_RESEARCH_PAPERS = [
  {
    _id: 'mock_paper_1',
    title: 'Distributed Consensus Protocols in Large-Scale Edge Computing Networks',
    journal: 'IEEE Transactions on Cloud Computing',
    publicationYear: 2025,
    doi: '10.1109/TCC.2025.10425',
    citationCount: 14,
    url: 'https://ieeexplore.ieee.org',
  },
  {
    _id: 'mock_paper_2',
    title: 'Automated Code Generation using Large Language Models: A Comprehensive Survey',
    journal: 'ACM Computing Surveys',
    publicationYear: 2026,
    doi: '10.1145/362548',
    citationCount: 22,
    url: 'https://dl.acm.org',
  },
  {
    _id: 'mock_paper_3',
    title: 'Quantum Key Distribution over Urban Fiber Networks',
    journal: 'Nature Quantum Information',
    publicationYear: 2024,
    doi: '10.1038/s41534-024',
    citationCount: 45,
    url: 'https://nature.com',
  },
];

const MOCK_BOOKS = [
  {
    _id: 'mock_book_1',
    title: 'Modern Architecture of Multi-Agent Systems',
    publisher: 'Springer Nature',
    publicationYear: 2025,
    isbn: '978-3-030-99455-1',
  },
  {
    _id: 'mock_book_2',
    title: 'Deep Learning for Cloud-Native Microservices',
    publisher: "O'Reilly Media",
    publicationYear: 2024,
    isbn: '978-1-492-05672-0',
  },
];

const MOCK_CERTIFICATES = [
  {
    _id: 'mock_cert_1',
    title: 'Advanced AI and Deep Learning Architecture Certification',
    issuingOrganization: 'Stanford Online / Coursera',
    issueDate: '2025-06-15',
    credentialId: 'CRED-STAN-DL-99451',
  },
  {
    _id: 'mock_cert_2',
    title: 'AWS Certified Solutions Architect - Professional',
    issuingOrganization: 'Amazon Web Services',
    issueDate: '2024-11-20',
    credentialId: 'AWS-PSA-883921',
  },
  {
    _id: 'mock_cert_3',
    title: 'Certified Information Systems Security Professional (CISSP)',
    issuingOrganization: 'ISC²',
    issueDate: '2023-08-10',
    credentialId: 'CISSP-992014',
  },
];

const MOCK_EVENTS = [
  {
    _id: 'mock_event_1',
    title: 'National Workshop on Applied Quantum Computing & Cryptography',
    type: 'Workshop',
    startDate: '2025-11-10',
    endDate: '2025-11-12',
    role: 'Coordinator',
    participantsCount: 120,
  },
  {
    _id: 'mock_event_2',
    title: 'International Conference on Next-Gen Cloud Security (ICNGCS 2026)',
    type: 'Conference',
    startDate: '2026-03-15',
    endDate: '2026-03-17',
    role: 'Keynote Organizer',
    participantsCount: 350,
  },
];

export const facultyService = {
  // 1. Research Papers
  getResearchPapers: async () => {
    try {
      const res = await apiFetch('/faculty/research-papers', { method: 'GET' });
      return res;
    } catch (err) {
      return { success: true, papers: MOCK_RESEARCH_PAPERS };
    }
  },
  createResearchPaper: async (data) => {
    try {
      return await apiFetch('/faculty/research-papers', { method: 'POST', body: data });
    } catch (err) {
      const newPaper = { _id: 'mock_paper_' + Date.now(), ...data };
      MOCK_RESEARCH_PAPERS.unshift(newPaper);
      return { success: true, paper: newPaper };
    }
  },
  updateResearchPaper: async (id, data) => {
    try {
      return await apiFetch(`/faculty/research-papers/${id}`, { method: 'PUT', body: data });
    } catch (err) {
      const idx = MOCK_RESEARCH_PAPERS.findIndex(p => p._id === id);
      if (idx !== -1) MOCK_RESEARCH_PAPERS[idx] = { ...MOCK_RESEARCH_PAPERS[idx], ...data };
      return { success: true, paper: MOCK_RESEARCH_PAPERS[idx] };
    }
  },
  deleteResearchPaper: async (id) => {
    try {
      return await apiFetch(`/faculty/research-papers/${id}`, { method: 'DELETE' });
    } catch (err) {
      const idx = MOCK_RESEARCH_PAPERS.findIndex(p => p._id === id);
      if (idx !== -1) MOCK_RESEARCH_PAPERS.splice(idx, 1);
      return { success: true, message: 'Deleted' };
    }
  },

  // 2. Books Published
  getBooks: async () => {
    try {
      return await apiFetch('/faculty/books', { method: 'GET' });
    } catch (err) {
      return { success: true, books: MOCK_BOOKS };
    }
  },
  createBook: async (data) => {
    try {
      return await apiFetch('/faculty/books', { method: 'POST', body: data });
    } catch (err) {
      const newBook = { _id: 'mock_book_' + Date.now(), ...data };
      MOCK_BOOKS.unshift(newBook);
      return { success: true, book: newBook };
    }
  },
  updateBook: async (id, data) => {
    try {
      return await apiFetch(`/faculty/books/${id}`, { method: 'PUT', body: data });
    } catch (err) {
      const idx = MOCK_BOOKS.findIndex(b => b._id === id);
      if (idx !== -1) MOCK_BOOKS[idx] = { ...MOCK_BOOKS[idx], ...data };
      return { success: true, book: MOCK_BOOKS[idx] };
    }
  },
  deleteBook: async (id) => {
    try {
      return await apiFetch(`/faculty/books/${id}`, { method: 'DELETE' });
    } catch (err) {
      const idx = MOCK_BOOKS.findIndex(b => b._id === id);
      if (idx !== -1) MOCK_BOOKS.splice(idx, 1);
      return { success: true, message: 'Deleted' };
    }
  },

  // 3. Certificates
  getCertificates: async () => {
    try {
      return await apiFetch('/faculty/certificates', { method: 'GET' });
    } catch (err) {
      return { success: true, certificates: MOCK_CERTIFICATES };
    }
  },
  createCertificate: async (data) => {
    try {
      return await apiFetch('/faculty/certificates', { method: 'POST', body: data });
    } catch (err) {
      const newCert = { _id: 'mock_cert_' + Date.now(), ...data };
      MOCK_CERTIFICATES.unshift(newCert);
      return { success: true, certificate: newCert };
    }
  },
  updateCertificate: async (id, data) => {
    try {
      return await apiFetch(`/faculty/certificates/${id}`, { method: 'PUT', body: data });
    } catch (err) {
      const idx = MOCK_CERTIFICATES.findIndex(c => c._id === id);
      if (idx !== -1) MOCK_CERTIFICATES[idx] = { ...MOCK_CERTIFICATES[idx], ...data };
      return { success: true, certificate: MOCK_CERTIFICATES[idx] };
    }
  },
  deleteCertificate: async (id) => {
    try {
      return await apiFetch(`/faculty/certificates/${id}`, { method: 'DELETE' });
    } catch (err) {
      const idx = MOCK_CERTIFICATES.findIndex(c => c._id === id);
      if (idx !== -1) MOCK_CERTIFICATES.splice(idx, 1);
      return { success: true, message: 'Deleted' };
    }
  },

  // 4. Events Organised
  getEvents: async () => {
    try {
      return await apiFetch('/faculty/events', { method: 'GET' });
    } catch (err) {
      return { success: true, events: MOCK_EVENTS };
    }
  },
  createEvent: async (data) => {
    try {
      return await apiFetch('/faculty/events', { method: 'POST', body: data });
    } catch (err) {
      const newEvt = { _id: 'mock_event_' + Date.now(), ...data };
      MOCK_EVENTS.unshift(newEvt);
      return { success: true, event: newEvt };
    }
  },
  updateEvent: async (id, data) => {
    try {
      return await apiFetch(`/faculty/events/${id}`, { method: 'PUT', body: data });
    } catch (err) {
      const idx = MOCK_EVENTS.findIndex(e => e._id === id);
      if (idx !== -1) MOCK_EVENTS[idx] = { ...MOCK_EVENTS[idx], ...data };
      return { success: true, event: MOCK_EVENTS[idx] };
    }
  },
  deleteEvent: async (id) => {
    try {
      return await apiFetch(`/faculty/events/${id}`, { method: 'DELETE' });
    } catch (err) {
      const idx = MOCK_EVENTS.findIndex(e => e._id === id);
      if (idx !== -1) MOCK_EVENTS.splice(idx, 1);
      return { success: true, message: 'Deleted' };
    }
  },

  // 5. KPI Metric API
  getKPI: async () => {
    try {
      return await apiFetch('/faculty/kpi', { method: 'GET' });
    } catch (err) {
      return {
        success: true,
        counts: {
          papers: MOCK_RESEARCH_PAPERS.length,
          books: MOCK_BOOKS.length,
          certificates: MOCK_CERTIFICATES.length,
          events: MOCK_EVENTS.length,
          selfRating: 4.5,
        },
      };
    }
  },

  // 6. AI Insights Engine API
  getAIInsights: async () => {
    try {
      return await apiFetch('/faculty/ai-insights', { method: 'GET' });
    } catch (err) {
      return {
        success: true,
        isHodReviewCompleted: true,
        status: 'Completed',
        hodComments: 'Faculty member demonstrates strong research output and effective classroom teaching.',
        analysisSummary: 'Based on completed HOD review comments: "Faculty member demonstrates strong research output and effective classroom teaching". The AI diagnostic engine highlights key strengths below.',
        strengths: [
          'HOD Review Remarks: "Faculty member demonstrates strong research output and effective classroom teaching."',
          'Teaching Quality: Rated highly by HOD for clear subject delivery and engagement.',
          'Research Papers: Active publication record in peer-reviewed journals.',
        ],
        opportunities: [
          'Certifications: HOD encourages enrolling in advanced specialized FDP courses.',
          'Event Leadership: Potential to lead national level technical workshops.',
        ],
        recommendations: [
          'Target SCOPUS Q1 journals for upcoming research submissions.',
          'Enroll in at least one certified FDP course this term.',
          'Propose a department webinar on emerging computing trends.',
        ],
      };
    }
  },
};

