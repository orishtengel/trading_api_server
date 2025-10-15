import { IDataManager } from '@manager/staticData/data.manager.interface';
import { GetKlinesRequest, GetSymbolsDataRequest } from '@manager/staticData/data.contracts';
import { Request, Response } from 'express';
import { BaseController } from '@shared/controllers';

export class DataController extends BaseController {
  constructor(private readonly dataManager: IDataManager) {
    super({
      enableLogging: false,
      loggingOptions: {
        extractUserId: (req) => req.params.userId || undefined,
      },
      enableAuth: true, // Data endpoints might not need auth - adjust as needed
    });

    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.addRoute('post', '/klines', this.getKlines);
    this.addRoute('post', '/symbolsData', this.getSymbolsData);
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
      res
        .status(response.status)
        .json(
          response.error ? { ok: false, error: response.error } : { ok: true, ...response.data },
        );
    } catch (error) {
      res.status(500).json({ ok: false, error: 'Failed to get klines data' });
    }
  }

  async getSymbolsData(req: Request, res: Response): Promise<void> {
    const { symbols } = req.body;

    // Validate required parameters
    if (!symbols || !Array.isArray(symbols)) {
      res.status(400).json({
        ok: false,
        error: 'Missing or invalid required parameter: symbols (must be an array)',
      });
      return;
    }

    if (symbols.length === 0) {
      res.status(400).json({
        ok: false,
        error: 'At least one symbol is required',
      });
      return;
    }

    // Prepare request for manager
    const request: GetSymbolsDataRequest = {
      symbols,
    };

    try {
      const response = await this.dataManager.getSymbolsData(request);
      res
        .status(response.status)
        .json(
          response.error ? { ok: false, error: response.error } : { ok: true, ...response.data },
        );
    } catch (error) {
      res.status(500).json({ ok: false, error: 'Failed to get symbols data' });
    }
  }

}
