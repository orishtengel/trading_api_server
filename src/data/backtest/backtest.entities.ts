import { BaseEntity } from '@data/core/baseEntity';

export interface BacktestEntity extends BaseEntity {
  name: string;
  userId: string;
  botId: string;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}