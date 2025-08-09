import { BotConfiguration } from '@service/bot/bot.models';

export interface CreateBotRequest {
  name: string;
  userId: string;
  status: 'active' | 'inactive' | 'paused' | 'error' | 'backtesting';
  configuration: BotConfiguration;
}

export interface CreateBotResponse {
  id: string;
  name: string;
  userId: string;
  status: 'active' | 'inactive' | 'paused' | 'error' | 'backtesting';
  configuration: BotConfiguration;
  createdAt: string;
  updatedAt: string;
} 