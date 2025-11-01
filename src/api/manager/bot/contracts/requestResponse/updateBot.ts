import { BotConfiguration } from '@service/bot/bot.models';

export interface UpdateBotRequest {
  id: string;
  name?: string;
  status?:
    | 'active'
    | 'inactive'
    | 'paused'
    | 'error'
    | 'backtesting'
    | 'livePreview'
    | 'idle'
    | 'live';
  configuration?: BotConfiguration;
  userId: string;
}

export interface UpdateBotResponse {
  id: string;
  name: string;
  userId: string;
  status:
    | 'active'
    | 'inactive'
    | 'paused'
    | 'error'
    | 'backtesting'
    | 'livePreview'
    | 'idle'
    | 'live';
  configuration: BotConfiguration;
  createdAt: string;
  updatedAt: string;
}
