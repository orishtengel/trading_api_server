import { ILivePreviewManager } from '@manager/livePreview/livePreview.manager.interface';
import { StartLivePreviewRequest } from '@manager/livePreview/contracts/requestResponse/startLivePreview';
import { StopLivePreviewRequest } from '@manager/livePreview/contracts/requestResponse/stopLivePreview';
import { Request, Response } from 'express';
import { BaseController } from '@shared/controllers';
import { GetPortfolioRequest } from '@manager/livePreview/livePreview.contracts';

export class LivePreviewController extends BaseController {
  constructor(private readonly livePreviewManager: ILivePreviewManager) {
    super({
      enableLogging: false,
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
    this.addRoute('get', '/:userId/bots/:botId/livePreview/portfolio', this.getPortfolio);
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
      if (response.error === 'Already Runnning') {
        res.status(200).json({ ok: true });
        return;
      }
      if (response.error) {
        res.status(response.status).json({ ok: false, error: response.error });
        return;
      }
      res.status(response.status).json({ ...response.data, ok: true });
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
    if (response.error) {
      res.status(response.status).json({ ok: false, error: response.error });
      return;
    }
    res.status(response.status).json({ ...response.data, ok: true });
  }

  async getPortfolio(req: Request, res: Response): Promise<void> {
    const { botId, userId } = req.params;
    if (!botId) {
      res.status(400).json({ ok: false, error: 'Missing required parameter: botId' });
      return;
    }
    if (!userId) {
      res.status(400).json({ ok: false, error: 'Missing required parameter: userId' });
      return;
    }
    const request: GetPortfolioRequest = { botId, userId };
    const response = await this.livePreviewManager.getPortfolio(request);
    if (response.error) {
      res.status(response.status).json({ ok: false, error: response.error });
      return;
    }
    res
      .status(response.status)
      .json({ ...response.data, timestamp: new Date().getTime(), ok: true });
  }
}
