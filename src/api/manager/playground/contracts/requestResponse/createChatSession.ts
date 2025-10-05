export interface PromptHistory {
  role: string;
  content: string;
}

export interface CreateChatSessionRequest {
  systemPrompt: string;
  history: PromptHistory[];
}

export interface CreateChatSessionResponse {
  sessionId: string;
}
