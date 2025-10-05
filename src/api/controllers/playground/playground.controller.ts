import { Request, Response } from 'express';
import { IPlaygroundManager } from '@manager/playground/playground.manager.interface';
import {
  PlayRequest,
  CreateChatSessionRequest,
  ChatRequest,
} from '@manager/playground/playground.contracts';
import { BaseController } from '@shared/controllers';

export class PlaygroundController extends BaseController {
  constructor(private readonly playgroundManager: IPlaygroundManager) {
    super({
      enableLogging: true,
      enableAuth: true, // Playground endpoints don't need auth for now
      loggingOptions: {
        extractUserId: (req) => req.params.sessionId || undefined,
      },
    });

    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.addRoute('post', '/:userId/bot/:botId/playground/play', this.play);
    this.addRoute(
      'post',
      '/:userId/bot/:botId/playground/createChatSession',
      this.createChatSession,
    );
    this.addRoute('post', '/:userId/bot/:botId/playground/chat/:sessionId', this.chat);
  }

  async play(req: Request, res: Response): Promise<void> {
    const request: PlayRequest = {
      botId: req.params.botId!,
      userId: req.params.userId!,
      agentId: req.body.agentId,
      testSize: Number(req.body.testSize),
    };

    const response = await this.playgroundManager.play(request);
    res.status(response.status).json(response.data || { error: response.error });
  }

  async createChatSession(req: Request, res: Response): Promise<void> {
    const request: CreateChatSessionRequest = {
      systemPrompt: req.body.systemPrompt,
      history: req.body.history,
    };

    const response = await this.playgroundManager.createChatSession(request);
    res.status(response.status).json(response.data || { error: response.error });
  }

  async chat(req: Request, res: Response): Promise<void> {
    const { sessionId } = req.params;

    if (!sessionId) {
      res.status(400).json({ error: 'Missing required parameter: sessionId' });
      return;
    }

    const request: ChatRequest = {
      sessionId,
      id: req.body.id,
      messages: req.body.messages,
      trigger: req.body.trigger,
    };

    try {
      // Get the streaming response from the manager
      const streamResponse = await this.playgroundManager.chatStream(request);
      
      if (streamResponse.error) {
        res.status(streamResponse.status).json({ error: streamResponse.error });
        return;
      }

      // Set appropriate headers for Server-Sent Events
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');
      
      // Pipe the stream to the response
      streamResponse.data!.pipe(res);
      
      // Handle stream errors
      streamResponse.data!.on('error', (error) => {
        console.error('Stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Stream error occurred' });
        }
      });

    } catch (error) {
      console.error('Chat streaming error:', error);
      res.status(500).json({ error: 'Failed to process chat request' });
    }
  }
}
