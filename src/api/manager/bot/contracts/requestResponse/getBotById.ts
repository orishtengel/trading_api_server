import { Agent } from '@service/bot/bot.models';

export interface GetBotByIdRequest {
  id: string;
}

export interface GetBotByIdResponse {
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