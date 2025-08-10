import { Router } from 'express';
import { BacktestController } from '@controller/backtest/backtest.controller';
import { BacktestManager } from '@manager/backtest/backtest.manager';
import { BotService } from '@service/bot/bot.service';
import { BotRepository } from '@data/bot/bot.repository';
import { TradingPlatformGrpcClient } from '@shared/grpc';

const router = Router();

// Dependency injection setup
const botRepository = new BotRepository();
const botService = new BotService(botRepository);
const grpcClient = new TradingPlatformGrpcClient();
const backtestManager = new BacktestManager(botService, grpcClient);
const backtestController = new BacktestController(backtestManager);

// GET /api/user/:userId/backtest/:botId (SSE)
router.get("/:userId/backtest/:botId", backtestController.runBacktest.bind(backtestController));

export default router;


