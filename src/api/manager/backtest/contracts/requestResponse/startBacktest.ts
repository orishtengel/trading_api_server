// Manager-layer contracts for running a backtest (SSE-oriented)

export interface StartBacktestRequest {
  botId: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  userId: string;
  name: string;
}


export interface StartBacktestResponse {
  backtestId: string;
}


