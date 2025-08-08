import { Router } from 'express';
import { AuthController } from '@controller/auth/auth.controller';

const router = Router();
const authController = new AuthController();

// POST /auth/verify-token - Verify Firebase ID token
router.post('/verify-token', authController.verifyToken.bind(authController));

// GET /auth/user/:uid - Get user by UID (for authenticated requests)
router.get('/user/:uid', authController.getCurrentUser.bind(authController));

export default router; 