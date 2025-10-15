export interface PlayRequest {
  agentId: string;
  testSize: number;
  userId: string;
  botId: string;
  prompt: string;
}

export interface PlayResponse {
  result: any;
}
