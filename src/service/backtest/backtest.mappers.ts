import { BacktestEntity } from '@data/backtest/backtest.entities';
import { Backtest } from './backtest.models';

export function mapBacktestEntityToBacktest(entity: BacktestEntity): Backtest {
  return {
    id: entity.id,
    name: entity.name,
    startDate: entity.startDate,
    endDate: entity.endDate,
    status: entity.status || ""
  };
}
