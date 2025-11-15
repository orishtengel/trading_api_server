import { BotConfigurationEntity } from '../../bot.entities';

export interface UpdateBotRequest {
  id: string;
  name?: string;
  mode?: 'stock' | 'crypto';
  status?:
    | 'active'
    | 'inactive'
    | 'paused'
    | 'error'
    | 'backtesting'
    | 'livePreview'
    | 'idle'
    | 'live';
  configuration?: BotConfigurationEntity;
  userId: string;
}
