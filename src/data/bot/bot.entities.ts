import { BaseEntity } from '@data/core/baseEntity';

export interface BotEntity extends BaseEntity {
  name: string;
  userId: string;
  status: 'active' | 'inactive' | 'paused' | 'error' | 'backtesting' | 'livePreview';
  configuration: BotConfigurationEntity;
  livePreview?: LivePreviewEntity | undefined;
}

export interface LivePreviewEntity {
  runtime: RuntimeEntity;
}

export interface RuntimeEntity {
  status: 'running' | 'stopped' | 'idle';
}

export interface BotConfigurationEntity {
  tokensCoordinates: number[];
  tokens: string[];
  dataSources: DataSourceEntity[];
  executer: ExecuterEntity | null;
  portfolio: PortfolioEntity | null;
  agents: AgentEntity[];
}

// Base interface for all agent types
export interface BaseAgentEntity {
  id: string;
  name: string;
  type: 'data' | 'portfolio' | 'agent' | 'executer' | 'currency';
  inputs: string[];
  tools?: string[];
  coordinates?: number[]; // New field for UI positioning
}

// Agent (AI Agent) Entity
export interface AIAgentEntity extends BaseAgentEntity {
  type: 'agent';
  configuration: AgentConfigurationEntity;
}

export interface AgentConfigurationEntity {
  provider: string;
  role: string;
  prompt: string;
  apiKey?: string;
}

// Portfolio Entity
export interface PortfolioEntity extends BaseAgentEntity {
  type: 'portfolio';
  riskLevel: 'low' | 'medium' | 'high';
  rebalanceFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  stopLoss: number;
  takeProfit: number;
  maxDrawdown: number;
  targetReturn: number;
}

// Currency Entity
export interface CurrencyEntity extends BaseAgentEntity {
  type: 'currency';
  selectedToken: TokenInfoEntity;
}

export interface TokenInfoEntity {
  symbol: string;
  name: string;
  price?: number;
  change24h?: number;
}

// Data Source Entity
export interface DataSourceEntity extends BaseAgentEntity {
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

// Executer Entity
export interface ExecuterEntity extends BaseAgentEntity {
  type: 'executer';
  exchange: string;
  apiKeyId?: string;
  configuration: ExecuterConfigurationEntity;
}

export interface ExecuterConfigurationEntity {
  executionMode: 'live' | 'backtest';
  orderType: 'market' | 'limit' | 'stop' | 'stop_limit' | 'trailing_stop';
  timeInForce: 'GTC' | 'IOC' | 'FOK' | 'DAY' | 'GTX';
}

// Union type for all agent entities
export type AgentEntity =
  | AIAgentEntity
  | PortfolioEntity
  | CurrencyEntity
  | DataSourceEntity
  | ExecuterEntity;
