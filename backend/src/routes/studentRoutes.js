import express from 'express';
import {
  getFaculties,
  submitFeedback,
  getFeedbackHistory,
  getAnnouncements,
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth protection & role restriction to all Student endpoints
router.use(protect);
router.use(authorize('Student'));

// Routes
router.route('/faculties').get(getFaculties);
router.route('/feedback').post(submitFeedback);
router.route('/history').get(getFeedbackHistory);
router.route('/announcements').get(getAnnouncements);

export default router;
