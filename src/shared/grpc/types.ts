/**
 * gRPC client types for TradingPlatform service
 * These types mirror the protobuf definitions
 */

export interface RunBacktestRequest {
  id?: string;
  configYaml?: string;
  startIso?: string;
  endIso?: string;
}

export interface BacktestEvent {
  type: string;
  payload_json: string;
}

// Re-export existing API types for consistency
export type BacktestEventType = 
  | 'prompt' 
  | 'klines' 
  | 'trade' 
  | 'progressPrepare' 
  | 'progressBacktest' 
  | 'complete' 
  | 'error' 
  | 'portfolio';

// Existing API types (should be imported from your actual API types file)
export interface ProgressPrepareEvent {
  step: number;
  progress: number;
  stepText: string;
}

export interface ProgressBacktestEvent {
  percent: number;
}

export interface ApiTradesEvent {
  trades: TradeApi[];
}

export interface ApiPromptsEvent {
  prompts: PromptApi[];
}

export interface ApiKlinesEvent {
  klines: KlineApi[];
}

export interface ApiPortfolioEvent {
  portfolio: PortfolioApi[];
}

export interface ApiErrorEvent {
  error: string;
}

export interface TradeApi {
  baseAsset: string;
  quoteAsset: string;
  side: "buy" | "sell";
  executedAmount: number;
  executedPrice: number;
  totalCost: number;
  fee: number;
  feeCurrency: string;
  success: boolean;
  timestamp: string; // Backend sends ISO string format
}

export interface PromptApi {
  prompt: string;
  agentName: string;
}

export interface KlineApi {
  baseAsset: string;
  quoteAsset: string;
  openTime: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: string;
  quoteAssetVolume: number;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: number;
  takerBuyQuoteAssetVolume: number;
}

export interface PositionApi {
  asset: string;
  amount: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  pnl: number;
}

export interface PortfolioApi {
  positions: PositionApi[];
  totalValue: number;
  weights: Record<string, number>; // symbol -> % of total
  realizedPnL: Record<string, number>;
  riskMetrics: {
    volatility: number;
    exposure: Record<string, number>; // base asset exposure
  };
}

// Union type for all possible event payloads
export type EventPayload = 
  | ApiTradesEvent 
  | TradeApi 
  | ProgressPrepareEvent 
  | ApiPromptsEvent 
  | ApiKlinesEvent 
  | KlineApi[] 
  | ApiPortfolioEvent 
  | ProgressBacktestEvent 
  | ApiErrorEvent
  | Record<string, unknown>;

// Typed backtest event with parsed payload
export interface TypedBacktestEvent<T = EventPayload> {
  type: BacktestEventType;
  data: T;
}

// Configuration for gRPC client
export interface GrpcClientConfig {
  host: string;
  port: number;
  credentials?: 'insecure' | 'secure';
  timeout?: number;
  keepaliveTimeMs?: number;
  keepaliveTimeoutMs?: number;
  keepalivePermitWithoutCalls?: boolean;
  maxReceiveMessageLength?: number;
  maxSendMessageLength?: number;
}

// Stream event handlers aligned with existing API types
export interface BacktestStreamHandlers {
  onEvent?: (event: TypedBacktestEvent) => void;
  onProgressPrepare?: (payload: ProgressPrepareEvent) => void;
  onProgressBacktest?: (payload: ProgressBacktestEvent) => void;
  onTrade?: (payload: ApiTradesEvent | TradeApi) => void;
  onPrompt?: (payload: ApiPromptsEvent) => void;
  onKlines?: (payload: ApiKlinesEvent | KlineApi[]) => void;
  onPortfolio?: (payload: ApiPortfolioEvent) => void;
  onComplete?: () => void;
  onError?: (payload: ApiErrorEvent) => void;
  onEnd?: () => void;
  onStreamError?: (error: Error) => void;
}
