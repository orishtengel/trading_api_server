import { Agent } from '@service/bot/bot.models';

export interface GetAllBotsRequest {
  userId?: string; // Optional filter by user
}

export interface GetAllBotsResponse {
    bots: {
    id: string;
    name: string;
    userId: string;
    tokens: string[];
    status: 'active' | 'inactive' | 'paused' | 'error' | 'backtesting';
    timeframe: string;
    agents: Agent[];
    createdAt: string;
    updatedAt: string;
}[];
} 