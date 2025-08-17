import { db } from '@shared/firebase/firebase.admin.config';
import { BacktestEntity } from './backtest.entities';
import { IBacktestRepository } from './backtest.repository.interface';

export class BacktestRepository implements IBacktestRepository {
  private getBacktestCollection(userId: string, botId: string) {
    return db.collection('bots').doc(userId).collection('bots').doc(botId).collection('backtest');
  }

  async findByUserIdAndBotId(userId: string, botId: string): Promise<BacktestEntity[]> {
    try {
      const snapshot = await this.getBacktestCollection(userId, botId)
        .get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data()?.name || "",
        status: doc.data()?.status || "",
        startDate: doc.data()?.startDate?.toDate() || "",
        endDate: doc.data()?.endDate?.toDate() || "",
      } as BacktestEntity));
    } catch (error) {
      console.error('Error finding backtests by userId and botId:', error);
      throw error;
    }
  }
}
