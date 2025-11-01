// Base Bot Model
export interface Bot {
  id: string;
  name: string;
  userId: string;
  status:
    | 'active'
    | 'inactive'
    | 'paused'
    | 'error'
    | 'backtesting'
    | 'livePreview'
    | 'idle'
    | 'live';
  configuration: BotConfiguration;
  livePreview?: LivePreview | undefined;
}

export interface LivePreview {
  runtime: Runtime;
}

export interface Runtime {
  status: 'running' | 'stopped' | 'idle';
}

export interface BotConfiguration {
  tokens: string[];
  dataSources: DataSource[];
  executer: Executer | null;
  portfolio: Portfolio | null;
  agents: Agent[];
  tokensCoordinates: number[];
}

// Base interface for all agent types
export interface BaseAgent {
  id: string;
  name: string;
  type: 'data' | 'portfolio' | 'agent' | 'executer' | 'currency';
  inputs: string[];
  coordinates?: number[]; // New field for UI positioning
}

// Portfolio Model
export interface Portfolio extends BaseAgent {
  type: 'portfolio';
  riskLevel: 'conservative' | 'balanced' | 'aggressive';
  minConfidence: number;
  maxExposurePerAsset: number;
  minExposureUSD: number;
  maxTradeAmount: number;
  minTradeAmount: number;
  stopLoss: number;
  takeProfit: number;
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
  sources?: Record<string, string[]>;
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

export interface Agent extends BaseAgent {
  type: 'agent';
  tools?: string[];
  provider: string;
  role: string;
  prompt: string;
  apiKey?: string;
}

// Input types for bot operations
export interface CreateBotInput {
  name: string;
  userId: string;
  status:
    | 'active'
    | 'inactive'
    | 'paused'
    | 'error'
    | 'backtesting'
    | 'livePreview'
    | 'idle'
    | 'live';
  configuration: BotConfiguration;
}

export interface UpdateBotInput {
  id: string;
  name?: string;
  status?:
    | 'active'
    | 'inactive'
    | 'paused'
    | 'error'
    | 'backtesting'
    | 'livePreview'
    | 'live'
    | 'idle';
  configuration?: BotConfiguration;
  userId: string;
}
