import { ApiResponse } from '@shared/http/api';
import {
  PlayRequest,
  PlayResponse,
  CreateChatSessionRequest,
  CreateChatSessionResponse,
  ChatRequest,
  ChatResponse,
} from './playground.contracts';

export interface IPlaygroundManager {
  play(request: PlayRequest): Promise<ApiResponse<PlayResponse>>;
  createChatSession(
    request: CreateChatSessionRequest,
  ): Promise<ApiResponse<CreateChatSessionResponse>>;
  chat(request: ChatRequest): Promise<ApiResponse<ChatResponse>>;
}
