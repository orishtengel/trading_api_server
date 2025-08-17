import { Request, Response } from "express";
import { applySseHeaders } from '@shared/http/cors';
import { IBacktestManager } from '@manager/backtest/backtest.manager.interface';
import { StartBacktestRequest, GetBacktestHistoryRequest } from '@manager/backtest/contracts/requestResponse';
import { StopBacktestRequest } from "@manager/backtest/contracts/requestResponse/stopBacktest";

export class BacktestController {
  constructor(private readonly backtestManager: IBacktestManager) {}

  async startBacktest(req: Request, res: Response): Promise<void> {
    const { botId, userId } = req.params;
    const { startDate, endDate, name } = req.body as { startDate?: string; endDate?: string; name?: string };

    // Validate required parameters
    if (!botId) {
      res.status(400).json({ ok: false, error: "Missing required parameter: botId" });
      return;
    }

    if (!userId) {
      res.status(400).json({ ok: false, error: "Missing required parameter: userId" });
      return;
    }

    if (!startDate || !endDate) {
      res.status(400).json({ ok: false, error: "Missing required parameters: startDate and endDate" });
      return;
    }

    // Prepare request for manager
    const request: StartBacktestRequest = {
      botId,
      startDate,
      endDate,
      userId: userId,
      name: name || "Backtest"
    };

    try {
      // Call manager with event callback for SSE streaming
     const response = await this.backtestManager.startBacktest(request);
     res.status(response.status).json({ ...response.data });

    } catch (error) {
      res.status(500).json({ ok: false, error: "Failed to start backtest" });
    }
  }

  async stopBacktest(req: Request, res: Response): Promise<void> {
    const { botId, userId } = req.params;
    const { backtestId } = req.body;
    if (!backtestId) {
      res.status(400).json({ ok: false, error: "Missing required parameter: backtestId" });
      return;
    }
    if (!botId) {
      res.status(400).json({ ok: false, error: "Missing required parameter: botId" });
      return;
    }
    if (!userId) {
      res.status(400).json({ ok: false, error: "Missing required parameter: userId" });
      return;
    }
    const request: StopBacktestRequest = { botId, userId, backtestId };
    const response = await this.backtestManager.stopBacktest(request);
    res.status(response.status).json({ ...response.data });
  }

  async getBacktestHistory(req: Request, res: Response): Promise<void> {
    const { userId, botId } = req.params;
    
    if (!userId) {
      res.status(400).json({ ok: false, error: "Missing required parameter: userId" });
      return;
    }
    
    if (!botId) {
      res.status(400).json({ ok: false, error: "Missing required parameter: botId" });
      return;
    }
    
    const request: GetBacktestHistoryRequest = { userId, botId };
    const response = await this.backtestManager.getBacktestHistory(request);
    res.status(response.status).json({ ...response.data });
  }
}


