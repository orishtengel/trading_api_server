import { z } from 'zod';
import { ApiError, ApiResponse } from '@shared/http/api';
import { AIServerApiService, KucoinApiService } from '@shared/http/api.service';
import { ILivePreviewManager } from '@manager/livePreview/livePreview.manager.interface';
import {
  GetPortfolioRequest,
  GetPortfolioResponse,
  StartLivePreviewRequest,
  StartLivePreviewResponse,
} from '@manager/livePreview/contracts/requestResponse';
import { IBotService } from '@service/bot/bot.service.interface';
import {
  StopLivePreviewRequest,
  StopLivePreviewResponse,
} from './contracts/requestResponse/stopLivePreview';
import { mapBotToYaml } from '@manager/backtest/mapper/mapConfigToYaml';

// Validation schema for backtest run
const startLivePreviewSchema = z.object({
  botId: z.string().min(1),
  userId: z.string().min(1),
});

const stopLivePreviewSchema = z.object({
  botId: z.string().min(1),
  userId: z.string().min(1),
});

const getPnlSchema = z.object({
  botId: z.string().min(1),
  userId: z.string().min(1),
});

export class LivePreviewManager implements ILivePreviewManager {
  constructor(private readonly botService: IBotService) {}

  async startLivePreview(
    request: StartLivePreviewRequest,
  ): Promise<ApiResponse<StartLivePreviewResponse>> {
    try {
      const validated = startLivePreviewSchema.parse(request);

      // Retrieve bot from Firebase to ensure it exists and get its configuration
      const bot = await this.botService.getBotById(validated.botId);
      console.log('bot', bot);

      if (!bot) {
        return ApiError('Bot not found', 404);
      }

      if (bot.userId !== validated.userId) {
        return ApiError('Unauthorized to access this bot', 403);
      }
      const yamlConfig = mapBotToYaml(bot);

      // Send backtest request to AI_SERVER
      const backtestPayload = {
        botId: validated.botId,
        userId: validated.userId,
        config: yamlConfig,
      };

      const aiServerResponse = await AIServerApiService.post<{ success: boolean }>(
        '/livePreview/start',
        backtestPayload,
      );
      if (aiServerResponse.error) {
        return ApiResponse({ success: false }, aiServerResponse.status, aiServerResponse.error);
      }

      return ApiResponse({ success: aiServerResponse.data!.success }, 200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map((e) => e.message).join(', '), 400);
      }
      console.error('Live preview error:', error);
      return ApiError('Failed to start live preview', 500);
    }
  }

  async stopLivePreview(
    request: StopLivePreviewRequest,
  ): Promise<ApiResponse<StopLivePreviewResponse>> {
    try {
      const validated = stopLivePreviewSchema.parse(request);

      const aiServerResponse = await AIServerApiService.post<{ success: boolean }>(
        '/livePreview/stop',
        validated,
      );

      if (aiServerResponse.error) {
        return ApiError(`AI Server error: ${aiServerResponse.error}`, aiServerResponse.status);
      }

      return ApiResponse({ success: aiServerResponse.data!.success }, 200);
    } catch (error) {
      return ApiError('Failed to stop live preview', 500);
    }
  }

  async getPortfolio(request: GetPortfolioRequest): Promise<ApiResponse<GetPortfolioResponse>> {
    try {
      const validated = getPnlSchema.parse(request);
      console.log('validated', validated);
      const aiServerResponse = await AIServerApiService.post<GetPortfolioResponse>(
        '/livePreview/portfolio',
        validated,
      );
      if (aiServerResponse.error) {
        return ApiError(`AI Server error: ${aiServerResponse.error}`, aiServerResponse.status);
      }

      return ApiResponse(aiServerResponse.data!, 200);
    } catch (error) {
      return ApiError('Failed to get pnl', 500);
    }
  }
}
