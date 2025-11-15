import { BotConfigurationEntity } from '../../bot.entities';

export interface CreateBotRequest {
  name: string;
  userId: string;
  mode: 'stock' | 'crypto';
  status:
    | 'active'
    | 'inactive'
    | 'paused'
    | 'error'
    | 'backtesting'
    | 'livePreview'
    | 'idle'
    | 'live';
  configuration: BotConfigurationEntity;
}
