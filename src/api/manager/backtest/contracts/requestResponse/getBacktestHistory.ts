export interface GetBacktestHistoryRequest {
  userId: string;
  botId: string;
}

export interface GetBacktestHistoryResponse {
  backtests: Backtest[];
}

export interface Backtest {
    name: string;
    startDate: string;
    endDate: string;
    status: string;
}