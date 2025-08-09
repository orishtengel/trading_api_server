import {
  CreateBotRequest,
  CreateBotResponse,
  GetBotByIdRequest,
  GetBotByIdResponse,
  UpdateBotRequest,
  UpdateBotResponse,
  DeleteBotRequest,
  DeleteBotResponse,
  GetAllBotsRequest,
  GetAllBotsResponse
} from './bot.contracts';
import { ApiResponse } from '@shared/http/api';

export interface IBotManager {
  createBot(request: CreateBotRequest): Promise<ApiResponse<CreateBotResponse>>;
  getBotById(request: GetBotByIdRequest): Promise<ApiResponse<GetBotByIdResponse>>;
  updateBot(request: UpdateBotRequest): Promise<ApiResponse<UpdateBotResponse>>;
  deleteBot(request: DeleteBotRequest): Promise<ApiResponse<DeleteBotResponse>>;
  getAllBots(request: GetAllBotsRequest): Promise<ApiResponse<GetAllBotsResponse>>;
} 