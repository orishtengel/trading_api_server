import { z } from 'zod';
import { ApiError, ApiResponse } from '@shared/http/api';
import { IBacktestManager } from '@manager/backtest/backtest.manager.interface';
import { RunBacktestRequest, RunBacktestResponse } from '@manager/backtest/backtest.contracts';
import { IBotService } from '@service/bot/bot.service.interface';
import { mapBotToYaml } from '@manager/backtest/mapper/mapConfigToYaml';
import { TradingPlatformGrpcClient } from '@shared/grpc';

// Validation schema for backtest run
const runBacktestSchema = z.object({
  botId: z.string().min(1),
  startDate: z.string().min(1), // Expect ISO strings across manager boundary
  endDate: z.string().min(1),
  userId: z.string().min(1)
});

export class BacktestManager implements IBacktestManager {
  constructor(private readonly botService: IBotService, private readonly grpcClient: TradingPlatformGrpcClient) {}

  private async simulatePreparingBacktest(eventCallback?: (event: { data: string; type: string; lastEventId?: string }) => void): Promise<void> {
    const steps = [
      { step: 1, progress: 50, stepText: 'Initializing backtest...' },
      { step: 2, progress: 100, stepText: 'Loading historical data...' },
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      if (eventCallback) {
        eventCallback({
          data: JSON.stringify({
            type: "progressPrepare",
            data: step
          }),
          type: 'progressPrepare'
        });
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async runBacktest(request: RunBacktestRequest, eventCallback?: (event: { data: string; type: string; lastEventId?: string }) => void): Promise<ApiResponse<RunBacktestResponse>> {
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

      await this.simulatePreparingBacktest(eventCallback);

      const yamlConfig = mapBotToYaml(bot);
      await this.grpcClient.runBacktest({
        configYaml: JSON.stringify(yamlConfig),
        startIso: validated.startDate,
        endIso: validated.endDate
      }, {
        onEvent: (payload) => eventCallback?.({ data: JSON.stringify(payload), type: 'progressPrepare' })
      });

      return ApiResponse({ event: { data: 'Backtest completed successfully', type: 'backtest-end' } }, 200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map(e => e.message).join(', '), 400);
      }
      return ApiError('Failed to run backtest', 500);
    }
  }
}


