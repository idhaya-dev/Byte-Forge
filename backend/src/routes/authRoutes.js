import express from 'express';
import { registerUser, registerStudent, loginUser, logoutUser, getUserProfile, refreshSession } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/register/student', registerStudent);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.post('/refresh', refreshSession);
router.get('/me', protect, getUserProfile);

export default router;
