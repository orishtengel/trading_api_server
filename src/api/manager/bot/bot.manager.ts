import { z } from 'zod';
import { IBotManager } from './bot.manager.interface';
import { IBotService } from '@service/bot/bot.service.interface';
import {
  CreateBotRequest,
  CreateBotResponse,
  GetBotByIdRequest,
  GetBotByIdResponse,
  UpdateBotRequest,
  UpdateBotResponse,
  DeleteBotRequest,
  DeleteBotResponse,
  GetAllBotsRequest,
  GetAllBotsResponse,
} from './bot.contracts';
import { CreateBotInput, UpdateBotInput, Bot } from '@service/bot/bot.models';
import { ApiError, ApiResponse } from '@shared/http/api';

// Validation schemas
const baseAgentSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.enum(['data', 'portfolio', 'agent', 'executer', 'currency']),
  inputs: z.array(z.string()),
  positions: z.array(z.number()).optional(), // For backwards compatibility
  coordinates: z.array(z.number()).optional(), // New field for UI positioning
});

const agentConfigurationSchema = z.object({
  provider: z.string(),
  role: z.string(),
  prompt: z.string(),
  apiKey: z.string().optional(),
});

const aiAgentSchema = baseAgentSchema
  .extend({
    type: z.literal('agent'),
    configuration: agentConfigurationSchema.optional(),
    // Flattened configuration fields for backwards compatibility
    provider: z.string().optional(),
    role: z.string().optional(),
    prompt: z.string().optional(),
    apiKey: z.string().optional(),
  })
  .passthrough();

const dataSourceSchema = baseAgentSchema
  .extend({
    type: z.literal('data'),
    dataSourceType: z.enum(['kucoin', 'news', 'twitter']),
    // KuCoin specific
    marketType: z.string().optional(),
    timeframe: z.string().optional(),
    // News specific
    sources: z.array(z.string()).optional(),
    // Twitter specific
    accounts: z.array(z.string()).optional(),
  })
  .passthrough();

const executerConfigurationSchema = z.object({
  executionMode: z.enum(['live', 'backtest']),
  orderType: z.enum(['market', 'limit', 'stop', 'stop_limit', 'trailing_stop']),
  timeInForce: z.enum(['GTC', 'IOC', 'FOK', 'DAY', 'GTX']),
});

const executerSchema = baseAgentSchema
  .extend({
    type: z.literal('executer'),
    exchange: z.string(),
    apiKeyId: z.string().optional(),
    configuration: executerConfigurationSchema,
  })
  .passthrough();

const portfolioSchema = baseAgentSchema
  .extend({
    type: z.literal('portfolio'),
    riskLevel: z.enum(['low', 'medium', 'high']),
    rebalanceFrequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
    stopLoss: z.number(),
    takeProfit: z.number(),
    maxDrawdown: z.number(),
    targetReturn: z.number(),
  })
  .passthrough();

const currencySchema = baseAgentSchema
  .extend({
    type: z.literal('currency'),
    selectedToken: z
      .object({
        symbol: z.string(),
        name: z.string(),
        price: z.number().optional(),
        change24h: z.number().optional(),
      })
      .optional(),
  })
  .passthrough();

// Union schema for all agent types
const agentSchema = z.discriminatedUnion('type', [
  aiAgentSchema,
  dataSourceSchema,
  executerSchema,
  portfolioSchema,
  currencySchema,
]);

const botConfigurationSchema = z.object({
  tokens: z.array(z.string()),
  dataSources: z.array(dataSourceSchema),
  executer: executerSchema.nullable(),
  portfolio: portfolioSchema.nullable(),
  agents: z.array(agentSchema),
  tokensCoordinates: z.array(z.number()),
});

const createBotSchema = z.object({
  name: z.string().min(1).max(255),
  userId: z.string().min(1),
  status: z.enum(['active', 'inactive', 'paused', 'error', 'backtesting']).optional(),
  configuration: botConfigurationSchema,
});

const updateBotSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(255).optional(),
  status: z.enum(['active', 'inactive', 'paused', 'error', 'backtesting']).optional(),
  configuration: botConfigurationSchema.optional(),
  userId: z.string().min(1),
});

const getBotByIdSchema = z.object({
  id: z.string().min(1),
});

const deleteBotSchema = z.object({
  id: z.string().min(1),
});

const getAllBotsSchema = z.object({
  userId: z.string().optional(),
});

export class BotManager implements IBotManager {
  constructor(private readonly botService: IBotService) {}

  async createBot(request: CreateBotRequest): Promise<ApiResponse<CreateBotResponse>> {
    try {
      const validatedRequest = createBotSchema.parse(request);

      const createInput: CreateBotInput = {
        name: validatedRequest.name,
        userId: validatedRequest.userId,
        status: validatedRequest.status || 'active',
        configuration: validatedRequest.configuration as any, // Type assertion for complex union types
      };

      const bot = await this.botService.createBot(createInput);

      // Get timestamps from service layer that still has access to BaseEntity
      const botWithTimestamps = await this.botService.getBotById(bot.id);
      if (!botWithTimestamps) {
        return ApiError('Failed to retrieve created bot', 500);
      }

      return ApiResponse(
        {
          id: bot.id,
          name: bot.name,
          userId: bot.userId,
          status: bot.status,
          configuration: bot.configuration,
          createdAt:
            (botWithTimestamps as any).createdAt?.toISOString() || new Date().toISOString(),
          updatedAt:
            (botWithTimestamps as any).updatedAt?.toISOString() || new Date().toISOString(),
        },
        201,
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map((e) => e.message).join(', '), 400);
      }
      return ApiError('Failed to create bot', 500);
    }
  }

  async getBotById(request: GetBotByIdRequest): Promise<ApiResponse<GetBotByIdResponse>> {
    try {
      const validatedRequest = getBotByIdSchema.parse(request);

      const bot = await this.botService.getBotById(validatedRequest.id);

      if (!bot) {
        return ApiError('Bot not found', 404);
      }

      return ApiResponse({
        id: bot.id,
        name: bot.name,
        userId: bot.userId,
        status: bot.status,
        configuration: bot.configuration,
        createdAt: (bot as any).createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: (bot as any).updatedAt?.toISOString() || new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map((e) => e.message).join(', '), 400);
      }
      return ApiError('Failed to get bot', 500);
    }
  }

  async updateBot(request: UpdateBotRequest): Promise<ApiResponse<UpdateBotResponse>> {
    try {
      const validatedRequest = updateBotSchema.parse(request);

      const updateInput: UpdateBotInput = {
        id: validatedRequest.id,
        name: validatedRequest.name,
        status: validatedRequest.status,
        configuration: validatedRequest.configuration as any, // Type assertion for complex union types
        userId: validatedRequest.userId,
      };
      console.log('updateInput', updateInput.configuration?.tokensCoordinates);
      const bot = await this.botService.updateBot(updateInput);

      if (!bot) {
        return ApiError('Bot not found', 404);
      }

      return ApiResponse({
        id: bot.id,
        name: bot.name,
        userId: bot.userId,
        status: bot.status,
        configuration: bot.configuration,
        createdAt: (bot as any).createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: (bot as any).updatedAt?.toISOString() || new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map((e) => e.message).join(', '), 400);
      }
      return ApiError('Failed to update bot', 500);
    }
  }

  async deleteBot(request: DeleteBotRequest): Promise<ApiResponse<DeleteBotResponse>> {
    try {
      const validatedRequest = deleteBotSchema.parse(request);

      const success = await this.botService.deleteBot(validatedRequest.id);

      if (!success) {
        return ApiError('Bot not found', 404);
      }

      return ApiResponse({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map((e) => e.message).join(', '), 400);
      }
      return ApiError('Failed to delete bot', 500);
    }
  }

  async getAllBots(request: GetAllBotsRequest): Promise<ApiResponse<GetAllBotsResponse>> {
    try {
      const validatedRequest = getAllBotsSchema.parse(request);

      let bots: Bot[];

      if (validatedRequest.userId) {
        bots = await this.botService.getBotsByUserId(validatedRequest.userId);
        const responseData = bots.map((bot) => ({
          id: bot.id,
          name: bot.name,
          userId: bot.userId,
          status: bot.status,
          configuration: bot.configuration,
          createdAt: (bot as any).createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: (bot as any).updatedAt?.toISOString() || new Date().toISOString(),
        }));
        return ApiResponse({ bots: responseData }, 200);
      }

      return ApiError('User not found', 404);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map((e) => e.message).join(', '), 400);
      }
      return ApiError('Failed to get bots', 500);
    }
  }
}
