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
// Configure gRPC client for long-running backtest operations
const grpcClient = new TradingPlatformGrpcClient({
  timeout: 1800000, // 30 minutes for backtest operations
  keepaliveTimeMs: 30000, // Keep connection alive with pings every 30 seconds
  keepaliveTimeoutMs: 10000, // Wait up to 10 seconds for keepalive response
  keepalivePermitWithoutCalls: true // Allow keepalive even when no active calls
});
const backtestManager = new BacktestManager(botService, grpcClient);
const backtestController = new BacktestController(backtestManager);

// GET /api/user/:userId/backtest/:botId (SSE)
router.get("/:userId/backtest/:botId", backtestController.runBacktest.bind(backtestController));

export default router;


