import { Router } from 'express';
import { BotService } from '@service/bot/bot.service';
import { BotRepository } from '@data/bot/bot.repository';
import { LivePreviewManager } from '@manager/livePreview/livePreview.manager';
import { LivePreviewController } from '@controller/livePreview/livePreview.controller';
import { AuthMiddleware } from '@shared/middleware/auth.middleware';

const router = Router();

// Authentication middleware
const authMiddleware = new AuthMiddleware();

// Dependency injection setup
const botRepository = new BotRepository();
const botService = new BotService(botRepository);
const livePreviewManager = new LivePreviewManager(botService);
const livePreviewController = new LivePreviewController(livePreviewManager);

// Apply authentication middleware to all user routes (including bots)
router.use('/api/user', authMiddleware.authenticate);

// Mount the bot controller under /api/user which expects /:userId/bots paths
router.use('/api/user', livePreviewController.getRouter());

export default router;
