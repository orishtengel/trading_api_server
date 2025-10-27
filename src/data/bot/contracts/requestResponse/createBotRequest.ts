import { BotConfigurationEntity } from '../../bot.entities';

export interface CreateBotRequest {
  name: string;
  userId: string;
  status: 'active' | 'inactive' | 'paused' | 'error' | 'backtesting' | 'livePreview';
  configuration: BotConfigurationEntity;
} 