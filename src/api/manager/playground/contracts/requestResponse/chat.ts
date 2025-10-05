export interface MessagePart {
  type: string;
  text: string;
}

export interface ChatMessage {
  role: string;
  parts: MessagePart[];
  id: string;
}

export interface ChatRequest {
  sessionId: string;
  id: string;
  messages: ChatMessage[];
  trigger: string;
}

export interface ChatMessageResponse {
  role: string;
  parts: MessagePart[];
  id: string;
}

export interface ChatResponse {
  messages: ChatMessageResponse[];
}
