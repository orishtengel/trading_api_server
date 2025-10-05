import { z } from 'zod';
import { ApiError, ApiResponse, ApiSuccess } from '@shared/http/api';
import { AIServerApiService } from '@shared/http/api.service';
import { IPlaygroundManager } from './playground.manager.interface';
import {
  PlayRequest,
  PlayResponse,
  CreateChatSessionRequest,
  CreateChatSessionResponse,
  ChatRequest,
  ChatResponse,
} from './playground.contracts';
import { IBotService } from '@service/bot/bot.service.interface';
import { mapBotToYaml } from '@manager/backtest/mapper/mapConfigToYaml';
import { v4 as uuidv4 } from 'uuid';



// Validation schemas
const playSchema = z.object({
  botId: z.string().min(1),
  userId: z.string().min(1),
  agentId: z.string().min(1),
  testSize: z.number().positive(),
});

const createChatSessionSchema = z.object({
  systemPrompt: z.string().min(1),
  history: z.array(
    z.object({
      role: z.string(),
      content: z.string(),
    }),
  ),
});

const chatSchema = z.object({
  sessionId: z.string().min(1),
  id: z.string().min(1),
  messages: z.array(z.object({
    role: z.string(),
    parts: z.array(z.object({
      type: z.string().optional(),
      text: z.string().optional(),
      state: z.string().optional(),
    })),
  })),
  trigger: z.string().min(1),
});

export class PlaygroundManager implements IPlaygroundManager {
  constructor(private readonly botService: IBotService) {}

  async play(request: PlayRequest): Promise<ApiResponse<PlayResponse>> {
    try {
      const validated = playSchema.parse(request);

      const bot = await this.botService.getBotById(validated.botId);

      if (!bot) {
        return ApiError('Bot not found', 404);
      }

      if (bot.userId !== validated.userId) {
        return ApiError('Unauthorized to access this bot', 403);
      }
      const yamlConfig = mapBotToYaml(bot);

      const aiServerResponse = await AIServerApiService.post<{ result: any }>('/playground/play', {
        config: yamlConfig,
        agentId: validated.agentId,
        testSize: validated.testSize,
      });

      if (aiServerResponse.error) {
        return ApiError(`AI Server error: ${aiServerResponse.error}`, aiServerResponse.status);
      }

      return ApiResponse({ result: aiServerResponse.data!.result }, 200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map((e) => e.message).join(', '), 400);
      }
      console.error('Playground play error:', error);
      return ApiError('Failed to execute playground', 500);
    }
  }

  async createChatSession(
    request: CreateChatSessionRequest,
  ): Promise<ApiResponse<CreateChatSessionResponse>> {
    try {
      const validated = createChatSessionSchema.parse(request);

      // Send create chat session request to AI_SERVER
      const sessionPayload = {
        systemPrompt: validated.systemPrompt,
        history: validated.history,
      };

      const aiServerResponse = await AIServerApiService.post<{ sessionId: string }>(
        '/playground/createChatSession',
        sessionPayload,
      );

      if (aiServerResponse.error) {
        return ApiError(`AI Server error: ${aiServerResponse.error}`, aiServerResponse.status);
      }

      return ApiResponse({ sessionId: aiServerResponse.data!.sessionId }, 200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map((e) => e.message).join(', '), 400);
      }
      console.error('Create chat session error:', error);
      return ApiError('Failed to create chat session', 500);
    }
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const validated = chatSchema.parse(request);

      // Send chat request to AI_SERVER
      const chatPayload = {
        message: validated.messages.map((message) => message.parts.map((part) => part.text)).join('\n'),
      };

      const aiServerResponse = await AIServerApiService.post<{ response: string }>(
        `/playground/chat/${validated.sessionId}`,
        chatPayload,
      );

      if (aiServerResponse.error) {
        if (aiServerResponse.status === 404) {
          return { messages: [] };
        }
        return { messages: [] };
      }
      return { messages: [{ role: 'assistant', parts: [{ type: 'text', text: aiServerResponse.data!.response }], id: validated.id }] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { messages: [] };
      }
      console.error('Chat error:', error);
      return { messages: [] };
    }
  }

  async chatStream(request: ChatRequest): Promise<ApiResponse<NodeJS.ReadableStream>> {
    try {
      const validated = chatSchema.parse(request);

      // Send chat request to AI_SERVER (regular POST, not streaming)
      const chatPayload = {
        message: validated.messages.map((message) => message.parts.map((part) => part.text)).join('\n'),
      };

      // Create a readable stream that will simulate streaming
      const { Readable } = require('stream');
      
      const stream = new Readable({
        read() {}
      });

      // Make the request to your AI server in the background
      (async () => {
        try {
          // Send start signal
          stream.push(`data: ${JSON.stringify({ type: "start" })}\n\n`);
          
          // Send start-step signal
          stream.push(`data: ${JSON.stringify({ type: "start-step" })}\n\n`);
          
          const aiServerResponse = await AIServerApiService.post<{ response: string }>(
            `/playground/chat/${validated.sessionId}`,
            chatPayload,
          );

          if (aiServerResponse.error) {
            stream.push(`data: ${JSON.stringify({ error: aiServerResponse.error })}\n\n`);
            stream.push(null); // End the stream
            return;
          }

          const fullResponse = aiServerResponse.data!.response;

          stream.push(`data: ${JSON.stringify({ type: "start" })}\n\n`);
          stream.push(`data: ${JSON.stringify({ type: "start-step" })}\n\n`);
          const messageId = uuidv4();
          
          // Send text-start with message ID
          stream.push(`data: ${JSON.stringify({ 
            type: "text-start", 
            id: messageId
          })}\n\n`);
          
          // Simulate streaming by sending the response in chunks
          const chunkSize = 10; // Send 100 characters at a time
          let index = 0;

          const sendChunk = () => {
            if (index < fullResponse.length) {
              const chunk = fullResponse.slice(index, index + chunkSize);
              stream.push(`data: ${JSON.stringify({ type: "text-delta", id: messageId, delta: chunk })}\n\n`);
              index += chunkSize;
              
              // Send next chunk after a small delay to simulate streaming
              setTimeout(sendChunk, 50); // 50ms delay between chunks
            } else {
              // Send finish-step signal
              stream.push(`data: ${JSON.stringify({ type: "finish-step" })}\n\n`);
              
              // Send finish signal
              stream.push(`data: ${JSON.stringify({ type: "finish" })}\n\n`);
              
              // Send final DONE signal
              stream.push(`data: [DONE]\n\n`);
              stream.push(null); // End the stream
            }
          };

          // Start sending chunks
          sendChunk();

        } catch (error) {
          console.error('Chat stream error:', error);
          stream.push(`data: ${JSON.stringify({ error: 'Failed to process chat request' })}\n\n`);
          stream.push(null);
        }
      })();

      return ApiSuccess(stream, 200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map((e) => e.message).join(', '), 400);
      }
      console.error('Chat stream error:', error);
      return ApiError('Failed to create chat stream', 500);
    }
  }
}
