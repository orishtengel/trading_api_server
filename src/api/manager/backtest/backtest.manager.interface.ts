import { ApiResponse } from '@shared/http/api';
import { StartBacktestRequest, StartBacktestResponse } from '@manager/backtest/contracts/requestResponse';
import { StopBacktestRequest, StopBacktestResponse } from '@manager/backtest/contracts/requestResponse/stopBacktest';
import { GetBacktestHistoryRequest, GetBacktestHistoryResponse } from '@manager/backtest/contracts/requestResponse/getBacktestHistory';

export interface IBacktestManager {
  startBacktest(request: StartBacktestRequest): Promise<ApiResponse<StartBacktestResponse>>;
  stopBacktest(request: StopBacktestRequest): Promise<ApiResponse<StopBacktestResponse>>;
  getBacktestHistory(request: GetBacktestHistoryRequest): Promise<ApiResponse<GetBacktestHistoryResponse>>;
}


