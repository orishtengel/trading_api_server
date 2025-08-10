// Manager-layer contracts for running a backtest (SSE-oriented)

export interface RunBacktestRequest {
  botId: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
}

export interface SSEEvent {
  data: string;
  type: string;
  lastEventId?: string;
}

export interface RunBacktestResponse {
  event: SSEEvent;
}


