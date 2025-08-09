import { Router } from 'express';
import { BotController } from '@controller/bot/bot.controller';
import { BotManager } from '@manager/bot/bot.manager';
import { BotService } from '@service/bot/bot.service';
import { BotRepository } from '@data/bot/bot.repository';
import { AuthMiddleware } from '@shared/middleware/auth.middleware';

const router = Router();

// Authentication middleware
const authMiddleware = new AuthMiddleware();

// Dependency injection setup
const botRepository = new BotRepository();
const botService = new BotService(botRepository);
const botManager = new BotManager(botService);
const botController = new BotController(botManager);

// Apply authentication middleware to all user routes (including bots)
router.use('/api/user', authMiddleware.authenticate);

// Mount the bot controller under /api/user which expects /:userId/bots paths
router.use('/api/user', botController.getRouter());

export default router; 