import { ILivePreviewManager } from '@manager/livePreview/livePreview.manager.interface';
import { StartLivePreviewRequest } from '@manager/livePreview/contracts/requestResponse/startLivePreview';
import { StopLivePreviewRequest } from '@manager/livePreview/contracts/requestResponse/stopLivePreview';
import { Request, Response } from 'express';
import { BaseController } from '@shared/controllers';

export class LivePreviewController extends BaseController {
  constructor(private readonly livePreviewManager: ILivePreviewManager) {
    super({
      enableLogging: true,
      loggingOptions: {
        extractUserId: (req) => req.params.userId || undefined,
      },
      enableAuth: true,
    });

    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.addRoute('post', '/:userId/bots/:botId/livePreview/start', this.startLivePreview);
    this.addRoute('post', '/:userId/bots/:botId/livePreview/stop', this.stopLivePreview);
  }

  public override getRouter() {
    return this.router;
  }

  async startLivePreview(req: Request, res: Response): Promise<void> {
    console.log('startLivePreview');
    const { botId, userId } = req.params;

    // Validate required parameters
    if (!botId) {
      res.status(400).json({ ok: false, error: 'Missing required parameter: botId' });
      return;
    }

    if (!userId) {
      res.status(400).json({ ok: false, error: 'Missing required parameter: userId' });
      return;
    }

    // Prepare request for manager
    const request: StartLivePreviewRequest = {
      botId,
      userId: userId,
    };

    try {
      // Call manager with event callback for SSE streaming
      const response = await this.livePreviewManager.startLivePreview(request);
      res.status(response.status).json({ ...response.data });
    } catch (error) {
      res.status(500).json({ ok: false, error: 'Failed to start live preview' });
    }
  }

  async stopLivePreview(req: Request, res: Response): Promise<void> {
    const { botId, userId } = req.params;
    if (!botId) {
      res.status(400).json({ ok: false, error: 'Missing required parameter: botId' });
      return;
    }
    if (!userId) {
      res.status(400).json({ ok: false, error: 'Missing required parameter: userId' });
      return;
    }
    const request: StopLivePreviewRequest = { botId, userId };
    const response = await this.livePreviewManager.stopLivePreview(request);
    res.status(response.status).json({ ...response.data });
  }
}
