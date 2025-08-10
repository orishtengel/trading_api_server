import { ApiResponse } from '@shared/http/api';
import { RunBacktestRequest, RunBacktestResponse, SSEEvent } from '@manager/backtest/backtest.contracts';

export interface IBacktestManager {
  runBacktest(request: RunBacktestRequest, eventCallback?: (event: SSEEvent) => void): Promise<ApiResponse<RunBacktestResponse>>;
}


