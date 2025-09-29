export interface GetPnlRequest {
  botId: string;
  userId: string;
  positions: PnlPortfolioPosition[];
  ledger: PnlLedgerItem[];
}

export interface GetPnlResponse {
  pnl: number;
  pnlPercentage: number;
  totalPrice: number;
  initialAmount: number;
  assetsPrices: Record<string, number>;
  assetsPnl: Record<string, number>;
}

export interface PnlPortfolioPosition {
  asset: string;
  amount: number;
  avgPrice: number;
}

export interface PnlLedgerItem {
  asset: string;
  amount: number;
  timestamp: string;
}
