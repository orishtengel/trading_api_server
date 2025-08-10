import path from "node:path";
import { loadPackageDefinition, credentials, ClientReadableStream } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import {
  RunBacktestRequest,
  BacktestEvent,
  TypedBacktestEvent,
  BacktestStreamHandlers,
  GrpcClientConfig,
  BacktestEventType,
  EventPayload
} from "./types";

// Resolve proto from project root
const PROTO_PATH = path.resolve(process.cwd(), "protos/trading_platform.proto");

const packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const grpcObject: any = loadPackageDefinition(packageDefinition);
const svc = grpcObject.tradingplatform.v1;

/**
 * gRPC client for TradingPlatform service
 * Provides methods to communicate with the gRPC backtest server
 */
export class TradingPlatformGrpcClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private client: any;
  private config: GrpcClientConfig;

  constructor(config: Partial<GrpcClientConfig> = {}) {
    this.config = {
      host: config.host ?? 'localhost',
      port: config.port ?? 50051,
      credentials: config.credentials ?? 'insecure',
      timeout: config.timeout ?? 300000, // 5 minutes default for long-running operations
      keepaliveTimeMs: config.keepaliveTimeMs ?? 30000, // Send keepalive ping every 30 seconds
      keepaliveTimeoutMs: config.keepaliveTimeoutMs ?? 5000, // Wait 5 seconds for keepalive response
      keepalivePermitWithoutCalls: config.keepalivePermitWithoutCalls ?? true, // Allow keepalive without active calls
      maxReceiveMessageLength: config.maxReceiveMessageLength ?? 1024 * 1024 * 4, // 4MB
      maxSendMessageLength: config.maxSendMessageLength ?? 1024 * 1024 * 4 // 4MB
    };

    const creds = this.config.credentials === 'secure' 
      ? credentials.createSsl()
      : credentials.createInsecure();

    // Configure channel options for long-running connections
    const channelOptions = {
      'grpc.keepalive_time_ms': this.config.keepaliveTimeMs,
      'grpc.keepalive_timeout_ms': this.config.keepaliveTimeoutMs,
      'grpc.keepalive_permit_without_calls': this.config.keepalivePermitWithoutCalls,
      'grpc.http2.max_pings_without_data': 0,
      'grpc.http2.min_time_between_pings_ms': 10000,
      'grpc.http2.min_ping_interval_without_data_ms': 300000,
      'grpc.max_receive_message_length': this.config.maxReceiveMessageLength,
      'grpc.max_send_message_length': this.config.maxSendMessageLength,
      'grpc.max_connection_idle_ms': 600000, // 10 minutes
      'grpc.max_connection_age_ms': 1800000, // 30 minutes
      'grpc.max_connection_age_grace_ms': 30000 // 30 seconds grace period
    };

    this.client = new svc.TradingPlatformService(
      `${this.config.host}:${this.config.port}`,
      creds,
      channelOptions
    );
  }

  /**
   * Run backtest and stream events
   * @param request - Backtest configuration
   * @param handlers - Event handlers for different event types
   * @param options - Optional call-specific options like deadline
   * @returns Promise that resolves when stream ends
   */
  async runBacktest(
    request: RunBacktestRequest,
    handlers: BacktestStreamHandlers = {},
    options?: { deadlineMs?: number }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Convert camelCase to snake_case for gRPC
      const grpcRequest = {
        id: request.id || "",
        config_yaml: request.configYaml || "",
        start_iso: request.startIso || "",
        end_iso: request.endIso || ""
      };

      // Set call-specific deadline (overrides global timeout if provided)
      const callTimeout = options?.deadlineMs || this.config.timeout || 300000; // Default 5 minutes
      const deadline = new Date(Date.now() + callTimeout);
      
      const callOptions = {
        deadline: deadline
      };

      const stream: ClientReadableStream<BacktestEvent> = this.client.RunBacktest(grpcRequest, callOptions);

      // Set timeout (as backup to gRPC deadline)
      const timeout = setTimeout(() => {
        stream.cancel();
        reject(new Error(`gRPC call timeout after ${callTimeout}ms`));
      }, callTimeout);

      stream.on('data', (event: BacktestEvent) => {
        try {
          const typedEvent = this.parseEvent(event);

          console.log('typedEvent', typedEvent);
          
          // Call generic event handler
          handlers.onEvent?.(typedEvent);
          
        } catch (error) {
          handlers.onStreamError?.(error as Error);
        }
      });

      stream.on('end', () => {
        clearTimeout(timeout);
        handlers.onEnd?.();
        resolve();
      });

      stream.on('error', (error: Error) => {
        clearTimeout(timeout);
        handlers.onStreamError?.(error);
        reject(error);
      });
    });
  }

  /**
   * Parse raw gRPC event to typed event
   */
  private parseEvent(event: BacktestEvent): TypedBacktestEvent {
    console.log('event', event);
    let payload: EventPayload;
    
    try {
      payload = JSON.parse(event.payload_json);
    } catch (error) {
      // If JSON parsing fails, return raw string as payload
      payload = { raw: event.payload_json };
    }

    return {
      type: event.type as BacktestEventType,
      data:payload,
    };
  }

  /**
   * Test connection to gRPC server
   */
  async testConnection(): Promise<boolean> {
    return new Promise((resolve) => {
      // Try to get service info to test connection
      this.client.getChannel().getConnectivityState(true);
      
      // Simple timeout test
      const timeout = setTimeout(() => resolve(false), 5000);
      
      // If we can create a channel, consider it connected
      try {
        this.client.getChannel().watchConnectivityState(
          this.client.getChannel().getConnectivityState(false),
          Date.now() + 5000,
          () => {
            clearTimeout(timeout);
            resolve(true);
          }
        );
      } catch {
        clearTimeout(timeout);
        resolve(false);
      }
    });
  }

  /**
   * Close the gRPC client
   */
  close(): void {
    if (this.client) {
      this.client.close();
    }
  }
}

/**
 * Create a default gRPC client instance
 */
export function createTradingPlatformClient(config?: Partial<GrpcClientConfig>): TradingPlatformGrpcClient {
  return new TradingPlatformGrpcClient(config);
}
