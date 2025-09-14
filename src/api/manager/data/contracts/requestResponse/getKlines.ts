export interface GetKlinesRequest {
  baseAssets: string[];
  interval: string;
}

export interface Candlestick {
  baseAsset: string;
  quoteAsset: string;
  openTime: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: string;
  quoteAssetVolume: number;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: number;
  takerBuyQuoteAssetVolume: number;
}

export interface GetKlinesResponse {
  candlesticks: Record<string, Candlestick[]>;
}
