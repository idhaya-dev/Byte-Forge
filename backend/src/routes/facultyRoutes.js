import express from 'express';
import {
  getResearchPapers,
  createResearchPaper,
  updateResearchPaper,
  deleteResearchPaper,
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getKPI,
  getAIInsights,
} from '../controllers/facultyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enforce authentication and Faculty role checks on all routes
router.use(protect);
router.use(authorize('Faculty'));

// Research Papers CRUD
router.route('/research-papers')
  .get(getResearchPapers)
  .post(createResearchPaper);
router.route('/research-papers/:id')
  .put(updateResearchPaper)
  .delete(deleteResearchPaper);

// Books Published CRUD
router.route('/books')
  .get(getBooks)
  .post(createBook);
router.route('/books/:id')
  .put(updateBook)
  .delete(deleteBook);

// Certificates CRUD
router.route('/certificates')
  .get(getCertificates)
  .post(createCertificate);
router.route('/certificates/:id')
  .put(updateCertificate)
  .delete(deleteCertificate);

// Events Organised CRUD
router.route('/events')
  .get(getEvents)
  .post(createEvent);
router.route('/events/:id')
  .put(updateEvent)
  .delete(deleteEvent);

// KPI Calculation
router.route('/kpi')
  .get(getKPI);

// AI Insights Generator
router.route('/ai-insights')
  .get(getAIInsights);

export default router;
