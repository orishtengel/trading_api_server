import { Router } from 'express';
import { PlaygroundController } from '@controller/playground/playground.controller';
import { PlaygroundManager } from '@manager/playground/playground.manager';
import { BotService } from '@service/bot/bot.service';
import { BotRepository } from '@data/bot/bot.repository';
import { AuthMiddleware } from '@shared/middleware';
const router = Router();
const authMiddleware = new AuthMiddleware();

// Dependency injection setup
const botRepository = new BotRepository();
const botService = new BotService(botRepository);
const playgroundManager = new PlaygroundManager(botService);
const playgroundController = new PlaygroundController(playgroundManager);
router.use('/api/user', authMiddleware.authenticate);
// Mount the playground controller routes under /api/playground
router.use('/api/user', playgroundController.getRouter());

export default router;
