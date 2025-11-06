export interface GetPortfolioRequest {
  botId: string;
  userId: string;
}

export interface GetPortfolioResponse {
  timestamp: number;
  totalProfit: number;
  totalProfitPercentage: number;
  positions: Position[];
  totalValue: number;
  weights: Record<string, number>;
  pnl: Record<string, PnL>;
}

export interface Position {
  asset: string;
  amount: number;
  value: number;
}

export interface Portfolio {
  positions: Position[];
  totalValue: number;
  weights: Record<string, number>; // symbol -> % of total
}

export interface PnL {
  unrealized: number;
  unrealizedPercentage: number;
}
