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
      timeout: config.timeout ?? 30000
    };

    const creds = this.config.credentials === 'secure' 
      ? credentials.createSsl()
      : credentials.createInsecure();

    this.client = new svc.TradingPlatformService(
      `${this.config.host}:${this.config.port}`,
      creds
    );
  }

  /**
   * Run backtest and stream events
   * @param request - Backtest configuration
   * @param handlers - Event handlers for different event types
   * @returns Promise that resolves when stream ends
   */
  async runBacktest(
    request: RunBacktestRequest,
    handlers: BacktestStreamHandlers = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Convert camelCase to snake_case for gRPC
      const grpcRequest = {
        id: request.id || "",
        config_yaml: request.configYaml || "",
        start_iso: request.startIso || "",
        end_iso: request.endIso || ""
      };

      const stream: ClientReadableStream<BacktestEvent> = this.client.RunBacktest(grpcRequest);

      // Set timeout
      const timeout = setTimeout(() => {
        stream.cancel();
        reject(new Error(`gRPC call timeout after ${this.config.timeout}ms`));
      }, this.config.timeout);

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
