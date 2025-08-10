import { BotConfigurationEntity } from 'src/data/bot/bot.entities';

export interface UpdateBotRequest {
  id: string;
  name?: string;
  status?: 'active' | 'inactive' | 'paused' | 'error' | 'backtesting';
  configuration?: BotConfigurationEntity;
  userId: string;
} 