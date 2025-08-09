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

// Apply authentication middleware to all bot routes
router.use('/api/bots', authMiddleware.authenticate);

// Use the controller's router which includes logging middleware
router.use('/api/bots', botController.getRouter());

export default router; 