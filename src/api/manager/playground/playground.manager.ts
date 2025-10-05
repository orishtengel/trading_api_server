import { z } from 'zod';
import { ApiError, ApiResponse } from '@shared/http/api';
import { AIServerApiService } from '@shared/http/api.service';
import { IPlaygroundManager } from './playground.manager.interface';
import {
  PlayRequest,
  PlayResponse,
  CreateChatSessionRequest,
  CreateChatSessionResponse,
  ChatRequest,
  ChatResponse,
  PromptHistory,
} from './playground.contracts';
import { IBotService } from '@service/bot/bot.service.interface';
import { mapBotToYaml } from '@manager/backtest/mapper/mapConfigToYaml';

// Validation schemas
const playSchema = z.object({
  botId: z.string().min(1),
  userId: z.string().min(1),
  agentId: z.string().min(1),
  testSize: z.number().positive(),
});

const createChatSessionSchema = z.object({
  systemPrompt: z.string().min(1),
  history: z.array(
    z.object({
      role: z.string(),
      content: z.string(),
    }),
  ),
});

const chatSchema = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1),
});

export class PlaygroundManager implements IPlaygroundManager {
  constructor(private readonly botService: IBotService) {}

  async play(request: PlayRequest): Promise<ApiResponse<PlayResponse>> {
    try {
      const validated = playSchema.parse(request);

      const bot = await this.botService.getBotById(validated.botId);

      if (!bot) {
        return ApiError('Bot not found', 404);
      }

      if (bot.userId !== validated.userId) {
        return ApiError('Unauthorized to access this bot', 403);
      }
      const yamlConfig = mapBotToYaml(bot);

      const aiServerResponse = await AIServerApiService.post<{ result: any }>('/playground/play', {
        config: yamlConfig,
        agentId: validated.agentId,
        testSize: validated.testSize,
      });

      if (aiServerResponse.error) {
        return ApiError(`AI Server error: ${aiServerResponse.error}`, aiServerResponse.status);
      }

      return ApiResponse({ result: aiServerResponse.data!.result }, 200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map((e) => e.message).join(', '), 400);
      }
      console.error('Playground play error:', error);
      return ApiError('Failed to execute playground', 500);
    }
  }

  async createChatSession(
    request: CreateChatSessionRequest,
  ): Promise<ApiResponse<CreateChatSessionResponse>> {
    try {
      const validated = createChatSessionSchema.parse(request);

      // Send create chat session request to AI_SERVER
      const sessionPayload = {
        systemPrompt: validated.systemPrompt,
        history: validated.history,
      };

      const aiServerResponse = await AIServerApiService.post<{ sessionId: string }>(
        '/playground/createChatSession',
        sessionPayload,
      );

      if (aiServerResponse.error) {
        return ApiError(`AI Server error: ${aiServerResponse.error}`, aiServerResponse.status);
      }

      return ApiResponse({ sessionId: aiServerResponse.data!.sessionId }, 200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map((e) => e.message).join(', '), 400);
      }
      console.error('Create chat session error:', error);
      return ApiError('Failed to create chat session', 500);
    }
  }

  async chat(request: ChatRequest): Promise<ApiResponse<ChatResponse>> {
    try {
      const validated = chatSchema.parse(request);

      // Send chat request to AI_SERVER
      const chatPayload = {
        message: validated.message,
      };

      const aiServerResponse = await AIServerApiService.post<{ response: string }>(
        `/playground/chat/${validated.sessionId}`,
        chatPayload,
      );

      if (aiServerResponse.error) {
        if (aiServerResponse.status === 404) {
          return ApiError('Session not found', 404);
        }
        return ApiError(`AI Server error: ${aiServerResponse.error}`, aiServerResponse.status);
      }

      return ApiResponse({ response: aiServerResponse.data!.response }, 200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map((e) => e.message).join(', '), 400);
      }
      console.error('Chat error:', error);
      return ApiError('Failed to send chat message', 500);
    }
  }
}
