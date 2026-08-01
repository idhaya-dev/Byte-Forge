import express from 'express';
import {
  submitSelfAppraisal,
  submitHODEvaluation,
  submitPeerEvaluation,
  getAppraisals,
  getAppraisalById,
} from '../controllers/appraisalController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are protected
router.use(protect);

router.route('/')
  .get(getAppraisals);

router.route('/self')
  .post(authorize('Faculty'), submitSelfAppraisal);

router.route('/:id')
  .get(getAppraisalById);

router.route('/:id/hod-eval')
  .post(authorize('HOD'), submitHODEvaluation);

router.route('/:id/peer-eval')
  .post(submitPeerEvaluation); // Any authenticated peer/faculty/HOD (checked inside controller)

export default router;
