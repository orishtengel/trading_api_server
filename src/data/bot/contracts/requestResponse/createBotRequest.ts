import { AgentEntity } from '../../bot.entities';

export interface CreateBotRequest {
  name: string;
  userId: string;
  tokens: string[];
  status: 'active' | 'inactive' | 'paused' | 'error' | 'backtesting';
  timeframe: string;
  agents: AgentEntity[];
} 