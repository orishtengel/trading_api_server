import { BotEntity } from 'src/data/bot/bot.entities';
import { CreateBotRequest, UpdateBotRequest, FindByIdRequest, DeleteBotRequest } from 'src/data/bot/contracts/requestResponse';

export interface IBotRepository {
  create(request: CreateBotRequest): Promise<BotEntity>;
  findById(request: FindByIdRequest): Promise<BotEntity | null>;
  findByUserId(userId: string): Promise<BotEntity[]>;
  update(request: UpdateBotRequest): Promise<BotEntity | null>;
  delete(request: DeleteBotRequest): Promise<boolean>;
  findAll(): Promise<BotEntity[]>;
} 