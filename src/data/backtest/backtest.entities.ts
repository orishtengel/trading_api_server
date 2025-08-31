import { BaseEntity } from '@data/core/baseEntity';

export interface BacktestEntity extends BaseEntity {
  name: string;
  userId: string;
  botId: string;
  status: string;
  startDate: number;
  endDate: number;
  createdAt: string;
  updatedAt: string;
}
