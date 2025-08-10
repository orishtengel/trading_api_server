import { BotConfigurationEntity } from 'src/data/bot/bot.entities';

export interface CreateBotRequest {
  name: string;
  userId: string;
  status: 'active' | 'inactive' | 'paused' | 'error' | 'backtesting';
  configuration: BotConfigurationEntity;
} 