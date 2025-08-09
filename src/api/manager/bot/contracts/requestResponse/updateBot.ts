import { Agent } from '@service/bot/bot.models';

export interface UpdateBotRequest {
  id: string;
  name?: string;
  tokens?: string[];
  status?: 'active' | 'inactive' | 'paused' | 'error' | 'backtesting';
  timeframe?: string;
  agents?: Agent[];
  userId: string;
}

export interface UpdateBotResponse {
    id: string;
    name: string;
    userId: string;
    tokens: string[];
    status: 'active' | 'inactive' | 'paused' | 'error' | 'backtesting';
    timeframe: string;
    agents: Agent[];
    createdAt: string;
    updatedAt: string;
} 