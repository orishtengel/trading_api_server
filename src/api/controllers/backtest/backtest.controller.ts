import { Router, Request, Response } from "express";
import { applySseHeaders } from '@shared/http/cors';

const router = Router();

// Temporary in-memory store for backtest configs
const backtestStore = new Map<string, any>();

// POST /api/user/:userId/backtest/save/:botId
router.post("/:userId/backtest/save/:botId", (req: Request, res: Response) => {
  const config = req.body;
  const { botId } = req.params;

  if (!config) {
    return res
      .status(400)
      .json({ ok: false, error: "Missing required fields: configuration" });
  }

  if (!botId) {
    return res
      .status(400)
      .json({ ok: false, error: "Missing required fields: botId" });
  }

  backtestStore.set(botId, config);
  res.status(200).json({ ok: true, id: botId });
});

// GET /api/user/:userId/backtest/:botId (SSE)
router.get("/:userId/backtest/:botId", async (req: Request, res: Response) => {
  const { botId, userId } = req.params;
  const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };

  if (!botId) {
    return res
      .status(400)
      .json({ ok: false, error: "Missing required parameter: botId" });
  }

  // You can use botId as the key for config lookup, or use a combination of userId and botId
  const config = backtestStore.get(botId);

  // Set SSE headers with proper CORS
  applySseHeaders(res);

  res.flushHeaders();

  // Simulate initial delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Send progress events
  res.write(
    `data: ${JSON.stringify({
      type: "progressPrepare",
      data: { step: 1, progress: 50, stepText: "Starting backtest..." },
    })}\n\n`
  );
  
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  res.write(
    `data: ${JSON.stringify({
      type: "progressPrepare", 
      data: { step: 2, progress: 100, stepText: "Loading historical data..." },
    })}\n\n`
  );

  // Simulate some trading events
  for (let i = 0; i < 5; i++) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    res.write(
      `data: ${JSON.stringify({
        type: "events",
        data: { 
          event: "trade_executed",
          price: 50000 + Math.random() * 1000,
          quantity: 0.1,
          timestamp: new Date().toISOString()
        }
      })}\n\n`
    );
  }

  // Send completion event
  res.write(
    `data: ${JSON.stringify({ type: "backtest-end" })}\n\n`
  );
  
  res.end();
});

export default router;


