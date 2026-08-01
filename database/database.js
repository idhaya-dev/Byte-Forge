import connectDB from './db.js';
import User from './models/User.js';
import Appraisal from './models/Appraisal.js';
import ResearchPaper from './models/ResearchPaper.js';
import BookPublished from './models/BookPublished.js';
import Certificate from './models/Certificate.js';
import EventOrganised from './models/EventOrganised.js';
import Announcement from './models/Announcement.js';
import Feedback from './models/Feedback.js';
import FeedbackHistory from './models/FeedbackHistory.js';

/**
 * Unified Database Layer Access Point.
 * Centralizes the connection and exports all models for clean imports.
 */
export {
  connectDB,
  User,
  Appraisal,
  ResearchPaper,
  BookPublished,
  Certificate,
  EventOrganised,
  Announcement,
  Feedback,
  FeedbackHistory
};
