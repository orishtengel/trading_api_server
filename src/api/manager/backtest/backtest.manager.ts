import { z } from 'zod';
import { ApiError, ApiResponse } from '@shared/http/api';
import { IBacktestManager } from '@manager/backtest/backtest.manager.interface';
import { RunBacktestRequest, RunBacktestResponse } from '@manager/backtest/backtest.contracts';

// Validation schema for backtest run
const runBacktestSchema = z.object({
  botId: z.string().min(1),
  startDate: z.string().min(1), // Expect ISO strings across manager boundary
  endDate: z.string().min(1)
});

export class BacktestManager implements IBacktestManager {
  async runBacktest(request: RunBacktestRequest, eventCallback?: (event: { data: string; type: string; lastEventId?: string }) => void): Promise<ApiResponse<RunBacktestResponse>> {
    try {
      const validated = runBacktestSchema.parse(request);

      // Simulate a real backtest process with multiple progress events
      const steps = [
        { step: 1, progress: 10, stepText: 'Initializing backtest...' },
        { step: 2, progress: 25, stepText: 'Loading historical data...' },
        { step: 3, progress: 50, stepText: 'Processing trading signals...' },
        { step: 4, progress: 75, stepText: 'Calculating performance metrics...' },
        { step: 5, progress: 90, stepText: 'Generating results...' },
        { step: 6, progress: 100, stepText: 'Backtest completed successfully' }
      ];

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        
        // Send progress event if callback is provided
        if (eventCallback) {
          eventCallback({
            data: JSON.stringify(step),
            type: 'progressPrepare'
          });
        }

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));
      }


      // Return a success response (not really used in SSE context, but required by interface)
      const finalEvent = {
        data: JSON.stringify({ step: 6, progress: 100, stepText: 'Backtest completed successfully' }),
        type: 'progressPrepare' as const,
      };

      return ApiResponse({ event: finalEvent }, 200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map(e => e.message).join(', '), 400);
      }
      return ApiError('Failed to run backtest', 500);
    }
  }
}


