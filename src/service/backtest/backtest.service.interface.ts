import { Backtest } from './backtest.models';

export interface IBacktestService {
  getBacktestHistory(userId: string, botId: string): Promise<Backtest[]>;
}
