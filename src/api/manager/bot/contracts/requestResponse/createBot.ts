import { Agent } from '@service/bot/bot.models';

export interface CreateBotRequest {
  name: string;
  userId: string;
  tokens: string[];
  status: 'active' | 'inactive' | 'paused' | 'error' | 'backtesting';
  timeframe: string;
  agents: Agent[];
}

export interface CreateBotResponse {
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