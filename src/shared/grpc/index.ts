/**
 * gRPC client module for TradingPlatform service
 * 
 * @example
 * ```typescript
 * import { createTradingPlatformClient, TradingPlatformGrpcClient } from '@shared/grpc';
 * 
 * const client = createTradingPlatformClient({
 *   host: 'localhost',
 *   port: 50051
 * });
 * 
 * await client.runBacktest({
 *   configYaml: 'your-config-yaml',
 *   startIso: '2024-01-01T00:00:00Z',
 *   endIso: '2024-01-31T23:59:59Z'
 * }, {
 *   onProgressPrepare: (payload) => console.log('Prepare:', payload),
 *   onTrade: (payload) => console.log('Trade:', payload),
 *   onComplete: () => console.log('Backtest completed'),
 *   onError: (error) => console.error('Error:', error)
 * });
 * ```
 */

export { TradingPlatformGrpcClient, createTradingPlatformClient } from './client';
export type {
  RunBacktestRequest,
  BacktestEvent,
  TypedBacktestEvent,
  BacktestStreamHandlers,
  GrpcClientConfig,
  BacktestEventType,
  EventPayload,
  ProgressPrepareEvent,
  ProgressBacktestEvent,
  ApiTradesEvent,
  ApiPromptsEvent,
  ApiKlinesEvent,
  ApiPortfolioEvent,
  ApiErrorEvent,
  TradeApi,
  PromptApi,
  KlineApi,
  PositionApi,
  PortfolioApi
} from './types';
