import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Public auth endpoints
router.post('/register', register);
router.post('/login', login);

// Protected user profile endpoint
router.get('/me', protect as any, getMe as any);

export default router;
