import { IDataManager } from '@manager/data/data.manager.interface';
import { GetKlinesRequest } from '@manager/data/data.contracts';
import { Request, Response } from 'express';
import { BaseController } from '@shared/controllers';

export class DataController extends BaseController {
  constructor(private readonly dataManager: IDataManager) {
    super({
      enableLogging: true,
      loggingOptions: {
        extractUserId: (req) => req.params.userId || undefined,
      },
      enableAuth: true, // Data endpoints might not need auth - adjust as needed
    });

    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.addRoute('post', '/klines', this.getKlines);
  }

  public override getRouter() {
    return this.router;
  }

  async getKlines(req: Request, res: Response): Promise<void> {
    const { baseAssets, interval } = req.body;
    const { userId } = req.params;

    // Validate required parameters
    if (!baseAssets || !Array.isArray(baseAssets)) {
      res.status(400).json({
        ok: false,
        error: 'Missing or invalid required parameter: baseAssets (must be an array)',
      });
      return;
    }

    if (!interval) {
      res.status(400).json({ ok: false, error: 'Missing required parameter: interval' });
      return;
    }

    // Prepare request for manager
    const request: GetKlinesRequest = {
      baseAssets,
      interval,
    };

    try {
      const response = await this.dataManager.getKlines(request);
      console.log(response);
      res
        .status(response.status)
        .json(
          response.error ? { ok: false, error: response.error } : { ok: true, ...response.data },
        );
    } catch (error) {
      res.status(500).json({ ok: false, error: 'Failed to get klines data' });
    }
  }
}
