import { Request, Response } from "express";
import { applySseHeaders } from '@shared/http/cors';
import { IBacktestManager } from '@manager/backtest/backtest.manager.interface';
import { RunBacktestRequest } from '@manager/backtest/backtest.contracts';

export class BacktestController {
  constructor(private readonly backtestManager: IBacktestManager) {}

  async runBacktest(req: Request, res: Response): Promise<void> {
    const { botId, userId } = req.params;
    const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };

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

    // Set SSE headers with proper CORS
    applySseHeaders(res);
    res.flushHeaders();

    // Prepare request for manager
    const request: RunBacktestRequest = {
      botId,
      startDate,
      endDate,
      userId: userId
    };

    // Define event callback for SSE streaming
    const eventCallback = (event: { data: string; type: string; lastEventId?: string }) => {
      const sseData = event.lastEventId 
        ? `id: ${event.lastEventId}\ndata: ${event.data}\n\n`
        : `data: ${event.data}\n\n`;
      
      res.write(sseData);
    };

    try {
      // Call manager with event callback for SSE streaming
     await this.backtestManager.runBacktest(request, eventCallback);

      // Send final completion event
      res.write(`data: ${JSON.stringify({ type: "backtest-end" })}\n\n`);
      
      res.end();
    } catch (error) {
      // Send error event and close connection
      res.write(`data: ${JSON.stringify({ type: "error", error: "Backtest failed" })}\n\n`);
      res.end();
    }
  }
}


