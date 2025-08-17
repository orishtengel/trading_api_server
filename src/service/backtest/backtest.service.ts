import { IBacktestRepository } from '@data/backtest/backtest.repository.interface';
import { IBacktestService } from './backtest.service.interface';
import { Backtest } from './backtest.models';
import { mapBacktestEntityToBacktest } from './backtest.mappers';

export class BacktestService implements IBacktestService {
  constructor(private readonly backtestRepository: IBacktestRepository) {}

  async getBacktestHistory(userId: string, botId: string): Promise<Backtest[]> {
    const backtestEntities = await this.backtestRepository.findByUserIdAndBotId(userId, botId);
    return backtestEntities.map(mapBacktestEntityToBacktest);
  }
}
