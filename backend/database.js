import connectDB from './src/config/db.js';
import User from './src/models/User.js';
import Appraisal from './src/models/Appraisal.js';
import ResearchPaper from './src/models/ResearchPaper.js';
import BookPublished from './src/models/BookPublished.js';
import Certificate from './src/models/Certificate.js';
import EventOrganised from './src/models/EventOrganised.js';
import Announcement from './src/models/Announcement.js';
import Feedback from './src/models/Feedback.js';
import FeedbackHistory from './src/models/FeedbackHistory.js';

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
