import { BotEntity } from './bot.entities';
import { CreateBotRequest, UpdateBotRequest, FindByIdRequest, DeleteBotRequest } from './contracts/requestResponse';

export interface IBotRepository {
  create(request: CreateBotRequest): Promise<BotEntity>;
  findById(request: FindByIdRequest): Promise<BotEntity | null>;
  findByUserId(userId: string): Promise<BotEntity[]>;
  update(request: UpdateBotRequest): Promise<BotEntity | null>;
  delete(request: DeleteBotRequest): Promise<boolean>;
  findAll(): Promise<BotEntity[]>;
} 