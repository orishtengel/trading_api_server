import { IBotService } from './bot.service.interface';
import { Bot, CreateBotInput, UpdateBotInput } from './bot.models';
import { IBotRepository } from '@data/bot/bot.repository.interface';
import { 
  mapBotEntityToBot, 
  mapCreateBotInputToCreateBotRequest, 
  mapUpdateBotInputToUpdateBotRequest 
} from './bot.mappers';

export class BotService implements IBotService {
  constructor(private readonly botRepository: IBotRepository) {}

  async createBot(input: CreateBotInput): Promise<Bot> {
    const createRequest = mapCreateBotInputToCreateBotRequest(input);
    const botEntity = await this.botRepository.create(createRequest);
    return mapBotEntityToBot(botEntity);
  }

  async getBotById(id: string): Promise<Bot | null> {
    const botEntity = await this.botRepository.findById({ id });
    return botEntity ? mapBotEntityToBot(botEntity) : null;
  }

  async getBotsByUserId(userId: string): Promise<Bot[]> {
    const botEntities = await this.botRepository.findByUserId(userId);
    return botEntities.map(mapBotEntityToBot);
  }

  async updateBot(input: UpdateBotInput): Promise<Bot | null> {
    const updateRequest = mapUpdateBotInputToUpdateBotRequest(input);
    const botEntity = await this.botRepository.update(updateRequest);
    return botEntity ? mapBotEntityToBot(botEntity) : null;
  }

  async deleteBot(id: string): Promise<boolean> {
    return await this.botRepository.delete({ id });
  }

  async getAllBots(): Promise<Bot[]> {
    const botEntities = await this.botRepository.findAll();
    return botEntities.map(mapBotEntityToBot);
  }
} 