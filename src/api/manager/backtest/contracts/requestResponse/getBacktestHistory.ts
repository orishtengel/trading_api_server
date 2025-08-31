export interface GetBacktestHistoryRequest {
  userId: string;
  botId: string;
}

export interface GetBacktestHistoryResponse {
  backtests: Backtest[];
}

export interface Backtest {
  name: string;
  startDate: number;
  endDate: number;
  status: string;
}
