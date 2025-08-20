import { Router } from 'express';
import { BacktestController } from '@controller/backtest/backtest.controller';
import { BacktestManager } from '@manager/backtest/backtest.manager';
import { BotService } from '@service/bot/bot.service';
import { BotRepository } from '@data/bot/bot.repository';
import { BacktestService } from '@service/backtest/backtest.service';
import { BacktestRepository } from '@data/backtest/backtest.repository';

const router = Router();

// Dependency injection setup
const botRepository = new BotRepository();
const botService = new BotService(botRepository);

const backtestRepository = new BacktestRepository();
const backtestService = new BacktestService(backtestRepository);

const backtestManager = new BacktestManager(botService, backtestService);
const backtestController = new BacktestController(backtestManager);

// POST /api/user/:userId/bot/:botId/backtest
router.post(
  '/:userId/bots/:botId/backtest/start',
  backtestController.startBacktest.bind(backtestController),
);
// POST /api/user/:userId/bot/:botId/backtest/:backtestId/stop
router.post(
  '/:userId/bots/:botId/backtest/stop',
  backtestController.stopBacktest.bind(backtestController),
);
// GET /api/user/:userId/bot/:botId/backtest/history
router.get(
  '/:userId/bots/:botId/backtest/history',
  backtestController.getBacktestHistory.bind(backtestController),
);

export default router;
