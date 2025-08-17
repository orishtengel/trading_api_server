export interface StopBacktestRequest {
  botId: string;
  userId: string;
  backtestId: string;
}

export interface StopBacktestResponse {
  success: boolean;
}