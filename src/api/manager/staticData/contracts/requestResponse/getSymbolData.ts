import { BinanceRollingWindowStats, BinanceCurrentPrice } from '@shared/utils/binance.utils';

export interface GetSymbolsDataRequest {
  symbols: string[];
}

export interface SymbolStatistics {
  now: BinanceCurrentPrice;
  twentyFourHour: BinanceRollingWindowStats;
  sevenDays: BinanceRollingWindowStats;
  thirtyDays: BinanceRollingWindowStats;
}

export interface GetSymbolsDataResponse {
  symbols: SymbolData[];
}

export interface SymbolData {
  symbol: string;
  statistics: SymbolStatistics;
}