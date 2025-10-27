import { BotConfiguration } from '@service/bot/bot.models';

export interface CreateBotRequest {
  name: string;
  userId: string;
  status: 'active' | 'inactive' | 'paused' | 'error' | 'backtesting' | 'livePreview';
  configuration: BotConfiguration;
}

export interface CreateBotResponse {
  id: string;
  name: string;
  userId: string;
  status: 'active' | 'inactive' | 'paused' | 'error' | 'backtesting' | 'livePreview';
  configuration: BotConfiguration;
  createdAt: string;
  updatedAt: string;
} 