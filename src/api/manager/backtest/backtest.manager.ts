import { z } from 'zod';
import { ApiError, ApiResponse } from '@shared/http/api';
import { AIServerApiService } from '@shared/http/api.service';
import { IBacktestManager } from '@manager/backtest/backtest.manager.interface';
import {
  GetBacktestHistoryRequest,
  GetBacktestHistoryResponse,
  StartBacktestRequest,
  StartBacktestResponse,
} from '@manager/backtest/contracts/requestResponse';
import { IBotService } from '@service/bot/bot.service.interface';
import { IBacktestService } from '@service/backtest/backtest.service.interface';
import { mapBotToYaml } from '@manager/backtest/mapper/mapConfigToYaml';
import {
  StopBacktestRequest,
  StopBacktestResponse,
} from './contracts/requestResponse/stopBacktest';

// Validation schema for backtest run
const runBacktestSchema = z.object({
  botId: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  userId: z.string().min(1),
  name: z.string().min(1),
});

const stopBacktestSchema = z.object({
  botId: z.string().min(1),
  userId: z.string().min(1),
  backtestId: z.string().min(1),
});

const getBacktestHistorySchema = z.object({
  userId: z.string().min(1),
  botId: z.string().min(1),
});

export class BacktestManager implements IBacktestManager {
  constructor(
    private readonly botService: IBotService,
    private readonly backtestService: IBacktestService,
  ) {}

  async startBacktest(request: StartBacktestRequest): Promise<ApiResponse<StartBacktestResponse>> {
    try {
      const validated = runBacktestSchema.parse(request);

      // Retrieve bot from Firebase to ensure it exists and get its configuration
      const bot = await this.botService.getBotById(validated.botId);

      if (!bot) {
        return ApiError('Bot not found', 404);
      }

      if (bot.userId !== validated.userId) {
        return ApiError('Unauthorized to access this bot', 403);
      }

      const yamlConfig = mapBotToYaml(bot);
      console.log('yamlConfig', yamlConfig);

      // Send backtest request to AI_SERVER
      const backtestPayload = {
        config: yamlConfig,
        botId: validated.botId,
        userId: validated.userId,
        name: validated.name,
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate),
      };

      const aiServerResponse = await AIServerApiService.post<{ backtestId: string }>(
        '/backtest/run',
        backtestPayload,
      );

      if (aiServerResponse.error) {
        return ApiError(`AI Server error: ${aiServerResponse.error}`, aiServerResponse.status);
      }

      return ApiResponse({ backtestId: aiServerResponse.data!.backtestId }, 200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map((e) => e.message).join(', '), 400);
      }
      console.error('Backtest error:', error);
      return ApiError('Failed to run backtest', 500);
    }
  }

  async stopBacktest(request: StopBacktestRequest): Promise<ApiResponse<StopBacktestResponse>> {
    try {
      const validated = stopBacktestSchema.parse(request);

      const aiServerResponse = await AIServerApiService.post<{ success: boolean }>(
        '/backtest/stop',
        validated,
      );

      if (aiServerResponse.error) {
        return ApiError(`AI Server error: ${aiServerResponse.error}`, aiServerResponse.status);
      }

      return ApiResponse({ success: aiServerResponse.data!.success }, 200);
    } catch (error) {
      return ApiError('Failed to stop backtest', 500);
    }
  }

  async getBacktestHistory(
    request: GetBacktestHistoryRequest,
  ): Promise<ApiResponse<GetBacktestHistoryResponse>> {
    try {
      const validated = getBacktestHistorySchema.parse(request);

      const backtests = await this.backtestService.getBacktestHistory(
        validated.userId,
        validated.botId,
      );

      return ApiResponse({ backtests }, 200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map((e) => e.message).join(', '), 400);
      }
      console.error('Get backtest history error:', error);
      return ApiError('Failed to get backtest history', 500);
    }
  }
}
