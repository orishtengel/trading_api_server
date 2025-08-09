import { AgentEntity } from '../../bot.entities';

export interface UpdateBotRequest {
  id: string;
  name?: string;
  tokens?: string[];
  status?: 'active' | 'inactive' | 'paused' | 'error' | 'backtesting';
  timeframe?: string;
  agents?: AgentEntity[];
  userId: string;
} 