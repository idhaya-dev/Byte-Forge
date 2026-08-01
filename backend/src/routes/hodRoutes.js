import express from 'express';
import {
  getDepartmentFaculty,
  getFacultyDetails,
  submitFacultyReview,
  getDepartmentAnalytics
} from '../controllers/hodController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enforce authentication and HOD role checks on all routes
router.use(protect);
router.use(authorize('HOD'));

// Department Faculty Management
router.route('/faculty')
  .get(getDepartmentFaculty);

router.route('/faculty/:id')
  .get(getFacultyDetails);

// Appraisal Evaluations
router.route('/appraisals/:appraisalId/review')
  .put(submitFacultyReview);

// Department Analytics Dashboard
router.route('/analytics')
  .get(getDepartmentAnalytics);

export default router;
