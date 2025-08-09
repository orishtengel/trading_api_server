import { Bot, CreateBotInput, UpdateBotInput } from './bot.models';

export interface IBotService {
  createBot(input: CreateBotInput): Promise<Bot>;
  getBotById(id: string): Promise<Bot | null>;
  getBotsByUserId(userId: string): Promise<Bot[]>;
  updateBot(input: UpdateBotInput): Promise<Bot | null>;
  deleteBot(id: string): Promise<boolean>;
  getAllBots(): Promise<Bot[]>;
} 