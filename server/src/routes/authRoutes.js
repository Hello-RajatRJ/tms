import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Public auth endpoints
router.post('/register', register);
router.post('/login', login);

// Protected user profile endpoint
router.get('/me', protect, getMe);

export default router;
