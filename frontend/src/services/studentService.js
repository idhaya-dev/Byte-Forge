import { apiFetch } from './api.js';

const MOCK_FACULTIES = [
  {
    _id: 'mock_faculty_id_1',
    name: 'Dr. Sarah Jenkins',
    department: 'Computer Science',
    designation: 'Associate Professor',
    coursesTaught: ['CS301: Distributed Systems', 'CS405: Cloud Security'],
  },
  {
    _id: 'mock_faculty_id_2',
    name: 'Dr. Alice Smith',
    department: 'Computer Science',
    designation: 'Professor',
    coursesTaught: ['CS201: Data Structures', 'CS502: Advanced Algorithms'],
  },
  {
    _id: 'mock_faculty_id_3',
    name: 'Prof. Bob Jones',
    department: 'Computer Science',
    designation: 'Associate Professor',
    coursesTaught: ['CS101: Intro to Computing', 'CS304: Database Systems'],
  },
];

const MOCK_ANNOUNCEMENTS = [
  {
    _id: 'ann_1',
    title: 'Student Feedback Portal is Live for AY 2026-2027',
    content: 'The course appraisal and feedback submission period is now open. Please submit reviews for all registered course instructors by next Friday.',
    postedByName: 'Dr. Richard Harris (HOD)',
    createdAt: '2026-07-25T09:00:00.000Z',
    targetRole: 'Student',
  },
  {
    _id: 'ann_2',
    title: 'Feedback Privacy & Double-Blind Anonymity Guarantee',
    content: 'All feedback ratings and comments are encrypted and strictly decoupled from your account identity. Neither faculty nor HOD can view individual identities.',
    postedByName: 'System Administrator',
    createdAt: '2026-07-26T11:30:00.000Z',
    targetRole: 'All',
  },
  {
    _id: 'ann_3',
    title: 'Department Research Symposium 2026 Poster Submission',
    content: 'Undergraduate student research poster submissions are open until August 25th.',
    postedByName: 'Dr. Sarah Jenkins',
    createdAt: '2026-07-28T14:15:00.000Z',
    targetRole: 'Student',
  },
];

const MOCK_FEEDBACK_HISTORY = [
  {
    _id: 'hist_1',
    facultyName: 'Dr. Sarah Jenkins',
    subject: 'CS301: Distributed Systems',
    teachingRating: 5,
    courseCoverageRating: 5,
    approachabilityRating: 4,
    comments: 'Exceptional teaching style with clear practical examples in distributed systems.',
    submittedAt: '2026-07-27T16:20:00.000Z',
  },
  {
    _id: 'hist_2',
    facultyName: 'Dr. Alice Smith',
    subject: 'CS201: Data Structures',
    teachingRating: 5,
    courseCoverageRating: 4,
    approachabilityRating: 5,
    comments: 'Very helpful during lab sessions and office hours.',
    submittedAt: '2026-07-28T11:10:00.000Z',
  },
];

export const studentService = {
  // Get list of all faculty members
  getFaculties: async () => {
    try {
      return await apiFetch('/student/faculties', { method: 'GET' });
    } catch (err) {
      return { success: true, faculties: MOCK_FACULTIES };
    }
  },

  // Submit feedback
  submitFeedback: async (feedbackData) => {
    try {
      return await apiFetch('/student/feedback', {
        method: 'POST',
        body: feedbackData,
      });
    } catch (err) {
      const foundFaculty = MOCK_FACULTIES.find(f => f._id === feedbackData.facultyId);
      const newHistoryItem = {
        _id: 'hist_' + Date.now(),
        facultyName: foundFaculty ? foundFaculty.name : 'Dr. Sarah Jenkins',
        subject: feedbackData.subject || 'CS Course Feedback',
        teachingRating: feedbackData.teachingRating || 5,
        courseCoverageRating: feedbackData.courseCoverageRating || 4,
        approachabilityRating: feedbackData.approachabilityRating || 5,
        comments: feedbackData.comments || 'Great instruction.',
        submittedAt: new Date().toISOString(),
      };
      MOCK_FEEDBACK_HISTORY.unshift(newHistoryItem);
      return { success: true, message: 'Feedback submitted anonymously.' };
    }
  },

  // Get student's review history
  getFeedbackHistory: async () => {
    try {
      return await apiFetch('/student/history', { method: 'GET' });
    } catch (err) {
      return { success: true, history: MOCK_FEEDBACK_HISTORY };
    }
  },

  // Get announcements for student
  getAnnouncements: async () => {
    try {
      return await apiFetch('/student/announcements', { method: 'GET' });
    } catch (err) {
      return { success: true, announcements: MOCK_ANNOUNCEMENTS };
    }
  },
};

