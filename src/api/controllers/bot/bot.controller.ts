import { Response } from 'express';
import { AuthenticatedRequest } from '@shared/middleware/auth.middleware';
import { IBotManager } from '@manager/bot/bot.manager.interface';
import {
  CreateBotRequest,
  GetBotByIdRequest,
  UpdateBotRequest,
  DeleteBotRequest,
  GetAllBotsRequest
} from '@manager/bot/bot.contracts';
import { BaseController } from '@shared/controllers';

export class BotController extends BaseController {
  constructor(private readonly botManager: IBotManager) {
    super({
      enableLogging: true,
      loggingOptions: {
        extractUserId: (req) => (req as AuthenticatedRequest).user?.uid || undefined
      }
    });
    
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.addRoute('post', '/', this.createBot);
    this.addRoute('get', '/:id', this.getBotById);
    this.addRoute('put', '/:id', this.updateBot);
    this.addRoute('delete', '/:id', this.deleteBot);
    this.addRoute('get', '/', this.getAllBots);
  }

  async createBot(req: AuthenticatedRequest, res: Response): Promise<void> {
    // Extract userId from authenticated user
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const createRequest: CreateBotRequest = {
      name: req.body.name,
      userId: userId, // Use the authenticated user's UID
      tokens: req.body.tokens,
      status: req.body.status,
      timeframe: req.body.timeframe,
      agents: req.body.agents
    };

    const response = await this.botManager.createBot(createRequest);
    res.status(response.status).json(response.data);
  }

  async getBotById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const getBotRequest: GetBotByIdRequest = {
      id: req.params.id!
    };

    const response = await this.botManager.getBotById(getBotRequest);
    res.status(response.status).json(response.data);
  }

  async updateBot(req: AuthenticatedRequest, res: Response): Promise<void> {
    const updateRequest: UpdateBotRequest = {
      id: req.params.id!,
      name: req.body.name,
      tokens: req.body.tokens,
      status: req.body.status,
      timeframe: req.body.timeframe,
      agents: req.body.agents,
      userId: req.user?.uid!
    };

    const response = await this.botManager.updateBot(updateRequest);
    res.status(response.status).json(response.data);
  }

  async deleteBot(req: AuthenticatedRequest, res: Response): Promise<void> {
    const deleteRequest: DeleteBotRequest = {
      id: req.params.id!
    };

    const response = await this.botManager.deleteBot(deleteRequest);
    res.status(response.status).json(response.data);
  }

  async getAllBots(req: AuthenticatedRequest, res: Response): Promise<void> {
    // Extract userId from authenticated user to filter bots by user
    const userId = req.user?.uid;
    
    const getAllRequest: GetAllBotsRequest = {
      userId: userId // Use authenticated user's UID to filter their bots
    };

    const response = await this.botManager.getAllBots(getAllRequest);
    res.status(response.status).json(response.data);
  }

  public override getRouter() {
    return this.router;
  }
} 