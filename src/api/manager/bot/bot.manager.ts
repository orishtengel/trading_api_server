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
  GetAllBotsResponse
} from './bot.contracts';
import { CreateBotInput, UpdateBotInput, Bot } from '@service/bot/bot.models';
import { ApiError, ApiResponse } from '@shared/http/api';

// Validation schemas
const agentSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.enum(['data', 'portfolio', 'agent', 'executer', 'currency']),
  inputs: z.array(z.string()),
  positions: z.array(z.number())
}).passthrough(); // Allow additional properties for different agent types

const createBotSchema = z.object({
  name: z.string().min(1).max(255),
  userId: z.string().min(1),
  tokens: z.array(z.string()),
  status: z.enum(['active', 'inactive', 'paused', 'error', 'backtesting']).optional(),
  timeframe: z.string().min(1),
  agents: z.array(agentSchema)
});

const updateBotSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(255).optional(),
  tokens: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive', 'paused', 'error', 'backtesting']).optional(),
  timeframe: z.string().min(1).optional(),
  agents: z.array(agentSchema).optional(),
  userId: z.string().min(1)
});

const getBotByIdSchema = z.object({
  id: z.string().min(1)
});

const deleteBotSchema = z.object({
  id: z.string().min(1)
});

const getAllBotsSchema = z.object({
  userId: z.string().optional()
});

export class BotManager implements IBotManager {
  constructor(private readonly botService: IBotService) {}

  async createBot(request: CreateBotRequest): Promise<ApiResponse<CreateBotResponse>> {
    try {
      const validatedRequest = createBotSchema.parse(request);
      
      const createInput: CreateBotInput = {
        name: validatedRequest.name,
        userId: validatedRequest.userId,
        tokens: validatedRequest.tokens,
        status: validatedRequest.status || 'active',
        timeframe: validatedRequest.timeframe,
        agents: validatedRequest.agents as any // Type assertion needed due to complex union types
      };

      const bot = await this.botService.createBot(createInput);
      
      return ApiResponse({
        id: bot.id,
        name: bot.name,
        userId: bot.userId,
        tokens: bot.tokens,
        status: bot.status,
        timeframe: bot.timeframe,
        agents: bot.agents,
        createdAt: bot.createdAt.toISOString(),
        updatedAt: bot.updatedAt.toISOString()
      }, 201);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map(e => e.message).join(', '), 400);
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
        tokens: bot.tokens,
        status: bot.status,
        timeframe: bot.timeframe,
        agents: bot.agents,
        createdAt: bot.createdAt.toISOString(),
        updatedAt: bot.updatedAt.toISOString()
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map(e => e.message).join(', '), 400);
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
        tokens: validatedRequest.tokens,
        status: validatedRequest.status,
        timeframe: validatedRequest.timeframe,
        agents: validatedRequest.agents as any, // Type assertion needed due to complex union types
        userId: validatedRequest.userId
      };

      console.log("updateInput", updateInput);

      const bot = await this.botService.updateBot(updateInput);
      
      if (!bot) {
        return ApiError('Bot not found', 404);
      }

      return ApiResponse({
        id: bot.id,
        name: bot.name,
        userId: bot.userId,
        tokens: bot.tokens,
        status: bot.status,
        timeframe: bot.timeframe,
        agents: bot.agents,
        createdAt: bot.createdAt.toISOString(),
        updatedAt: bot.updatedAt.toISOString()
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map(e => e.message).join(', '), 400);
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
        return ApiError('Validation failed: ' + error.errors.map(e => e.message).join(', '), 400);
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
      } else {
        bots = await this.botService.getAllBots();
      }

      const responseData = bots.map(bot => ({
        id: bot.id,
        name: bot.name,
        userId: bot.userId,
        tokens: bot.tokens,
        status: bot.status,
        timeframe: bot.timeframe,
        agents: bot.agents,
        createdAt: bot.createdAt.toISOString(),
        updatedAt: bot.updatedAt.toISOString()
      }));

      return ApiResponse({ bots: responseData }, 200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map(e => e.message).join(', '), 400);
      }
      return ApiError('Failed to get bots', 500);
    }
  }
} 