import { Router } from 'express';
import { AuthController } from '@controller/auth/auth.controller';

const router = Router();
const authController = new AuthController();

// Mount the auth controller routes under /api/auth
router.use('/api/auth', authController.getRouter());

export default router; 