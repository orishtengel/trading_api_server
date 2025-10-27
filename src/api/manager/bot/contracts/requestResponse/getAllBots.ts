import { BotConfiguration, LivePreview } from '@service/bot/bot.models';

export interface GetAllBotsRequest {
  userId?: string; // Optional filter by user
}

export interface GetAllBotsResponse {
  bots: {
    id: string;
    name: string;
    userId: string;
    status: 'active' | 'inactive' | 'paused' | 'error' | 'backtesting' | 'livePreview';
    configuration: BotConfiguration;
    livePreview?: LivePreview;
    createdAt: string;
    updatedAt: string;
  }[];
} 