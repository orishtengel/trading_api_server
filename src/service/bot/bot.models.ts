// Base Bot Model
export interface Bot {
  id: string;
  name: string;
  userId: string;
  tokens: string[];
  status: 'active' | 'inactive' | 'paused' | 'error' | 'backtesting';
  timeframe: string;
  agents: Agent[];
  createdAt: Date;
  updatedAt: Date;
}

// Base interface for all agent types
export interface BaseAgent {
  id: string;
  name: string;
  type: 'data' | 'portfolio' | 'agent' | 'executer' | 'currency';
  inputs: string[];
  positions: number[];
}

// AI Agent Model
export interface AIAgent extends BaseAgent {
  type: 'agent';
  configuration: AgentConfiguration;
}

export interface AgentConfiguration {
  provider: string;
  role: string;
  prompt: string;
  apiKey?: string;
}

// Portfolio Model
export interface Portfolio extends BaseAgent {
  type: 'portfolio';
  riskLevel: 'low' | 'medium' | 'high';
  rebalanceFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  stopLoss: number;
  takeProfit: number;
  maxDrawdown: number;
  targetReturn: number;
}

// Currency Model
export interface Currency extends BaseAgent {
  type: 'currency';
  selectedToken: TokenInfo;
}

export interface TokenInfo {
  symbol: string;
  name: string;
  price?: number;
  change24h?: number;
}

// Data Source Model
export interface DataSource extends BaseAgent {
  type: 'data';
  dataSourceType: 'kucoin' | 'news' | 'twitter';
  // KuCoin specific
  marketType?: string;
  timeframe?: string;
  // News specific
  sources?: string[];
  // Twitter specific
  accounts?: string[];
}

// Executer Model
export interface Executer extends BaseAgent {
  type: 'executer';
  exchange: string;
  apiKeyId?: string;
  configuration: ExecuterConfiguration;
}

export interface ExecuterConfiguration {
  executionMode: 'live' | 'backtest';
  orderType: 'market' | 'limit' | 'stop' | 'stop_limit' | 'trailing_stop';
  timeInForce: 'GTC' | 'IOC' | 'FOK' | 'DAY' | 'GTX';
}

// Union type for all agent models
export type Agent = 
  | AIAgent 
  | Portfolio 
  | Currency 
  | DataSource 
  | Executer;

// Input types for bot operations
export interface CreateBotInput {
  name: string;
  userId: string;
  tokens: string[];
  status: 'active' | 'inactive' | 'paused' | 'error' | 'backtesting';
  timeframe: string;
  agents: Agent[];
}

export interface UpdateBotInput {
  id: string;
  name?: string;
  tokens?: string[];
  status?: 'active' | 'inactive' | 'paused' | 'error' | 'backtesting';
  timeframe?: string;
  agents?: Agent[];
  userId: string;
} 