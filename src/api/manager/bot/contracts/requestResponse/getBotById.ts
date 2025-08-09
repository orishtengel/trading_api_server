import { BotConfiguration } from '@service/bot/bot.models';

export interface GetBotByIdRequest {
  id: string;
}

export interface GetBotByIdResponse {
  id: string;
  name: string;
  userId: string;
  status: 'active' | 'inactive' | 'paused' | 'error' | 'backtesting';
  configuration: BotConfiguration;
  createdAt: string;
  updatedAt: string;
} 