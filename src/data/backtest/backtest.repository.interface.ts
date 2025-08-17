import { BacktestEntity } from './backtest.entities';

export interface IBacktestRepository {
  findByUserIdAndBotId(userId: string, botId: string): Promise<BacktestEntity[]>;
}