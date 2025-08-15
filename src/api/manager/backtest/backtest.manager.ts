import { z } from 'zod';
import { ApiError, ApiResponse } from '@shared/http/api';
import { IBacktestManager } from '@manager/backtest/backtest.manager.interface';
import { RunBacktestRequest, RunBacktestResponse } from '@manager/backtest/backtest.contracts';
import { IBotService } from '@service/bot/bot.service.interface';
import { IBacktestService } from '@service/backtest/backtest.service.interface';
import { mapBotToYaml } from '@manager/backtest/mapper/mapConfigToYaml';
import { TradingPlatformGrpcClient } from '@shared/grpc';
import { TypedBacktestEvent, TradeApi, ApiTradesEvent, ApiPortfolioEvent, ProgressPrepareEvent, ProgressBacktestEvent, ApiKlinesEvent, ApiPromptsEvent, ApiErrorEvent } from '@shared/grpc/types';

// Validation schema for backtest run
const runBacktestSchema = z.object({
  botId: z.string().min(1),
  startDate: z.string().min(1), // Expect ISO strings across manager boundary
  endDate: z.string().min(1),
  userId: z.string().min(1)
});

export class BacktestManager implements IBacktestManager {
  constructor(
    private readonly botService: IBotService, 
    private readonly backtestService: IBacktestService,
    private readonly grpcClient: TradingPlatformGrpcClient
  ) {}

  private async simulatePreparingBacktest(eventCallback?: (event: { data: string; type: string; lastEventId?: string }) => void): Promise<void> {
    const steps = [
      { step: 1, progress: 50, stepText: 'Initializing backtest...' },
      { step: 2, progress: 100, stepText: 'Loading historical data...' },
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      if (eventCallback) {
        eventCallback({
          data: JSON.stringify({
            type: "progressPrepare",
            data: step
          }),
          type: 'progressPrepare'
        });
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async runBacktest(request: RunBacktestRequest, eventCallback?: (event: { data: string; type: string; lastEventId?: string }) => void): Promise<ApiResponse<RunBacktestResponse>> {
    try {
      const validated = runBacktestSchema.parse(request);

      // Retrieve bot from Firebase to ensure it exists and get its configuration
      const bot = await this.botService.getBotById(validated.botId);
      
      if (!bot) {
        return ApiError('Bot not found', 404);
      }

      if (bot.userId !== validated.userId) {
        return ApiError('Unauthorized to access this bot', 403);
      }

      // Create backtest result in Firestore
      const backtestResult = await this.backtestService.createBacktestResult({
        userId: validated.userId,
        botId: validated.botId,
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate),
        metadata: {
          botName: bot.name,
          configYaml: JSON.stringify(mapBotToYaml(bot)),
          duration: 0, // Will be updated when completed
        }
      });

      let eventSequence = 0;

      await this.simulatePreparingBacktest(eventCallback);

      const yamlConfig = mapBotToYaml(bot);
      await this.grpcClient.runBacktest({
        configYaml: JSON.stringify(yamlConfig),
        startIso: validated.startDate,
        endIso: validated.endDate
      }, {
        onEvent: async (typedEvent: TypedBacktestEvent) => {
          await this.handleBacktestEvent(backtestResult.id, typedEvent, eventSequence++);
          eventCallback?.({ 
            data: JSON.stringify(typedEvent), 
            type: typedEvent.type 
          });
        },
        onTrade: async (tradeEvent: ApiTradesEvent | TradeApi) => {
          await this.handleTradeEvent(backtestResult.id, tradeEvent, eventSequence++);
        },
        onPortfolio: async (portfolioEvent: ApiPortfolioEvent) => {
          await this.handlePortfolioEvent(backtestResult.id, portfolioEvent, eventSequence++);
        },
        onComplete: async () => {
          await this.backtestService.completeBacktest(backtestResult.id);
        },
        onError: async (errorEvent: ApiErrorEvent) => {
          await this.backtestService.saveBacktestEvent({
            backtestId: backtestResult.id,
            eventType: 'error',
            eventData: JSON.stringify(errorEvent),
            timestamp: new Date(),
            sequenceNumber: eventSequence++
          });
          await this.backtestService.updateBacktestResult({
            id: backtestResult.id,
            status: 'failed'
          });
        }
      }, {
        deadlineMs: 1800000 // 30 minutes deadline for backtest operations
      });

      return ApiResponse({ event: { data: 'Backtest completed successfully', type: 'backtest-end' } }, 200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map(e => e.message).join(', '), 400);
      }
      console.error('Backtest error:', error);
      return ApiError('Failed to run backtest', 500);
    }
  }

  private async handleBacktestEvent(backtestId: string, event: TypedBacktestEvent, sequenceNumber: number): Promise<void> {
    try {
      await this.backtestService.saveBacktestEvent({
        backtestId,
        eventType: event.type,
        eventData: JSON.stringify(event.data),
        timestamp: new Date(),
        sequenceNumber
      });
    } catch (error) {
      console.error('Error saving backtest event:', error);
    }
  }

  private async handleTradeEvent(backtestId: string, tradeEvent: ApiTradesEvent | TradeApi, sequenceNumber: number): Promise<void> {
    try {
      // Handle both single trade and multiple trades
      const trades = 'trades' in tradeEvent ? tradeEvent.trades : [tradeEvent];
      
      for (const trade of trades) {
        await this.backtestService.saveBacktestTrade({
          backtestId,
          baseAsset: trade.baseAsset,
          quoteAsset: trade.quoteAsset,
          side: trade.side,
          executedAmount: trade.executedAmount,
          executedPrice: trade.executedPrice,
          totalCost: trade.totalCost,
          fee: trade.fee,
          feeCurrency: trade.feeCurrency,
          success: trade.success,
          timestamp: new Date(trade.timestamp),
          sequenceNumber: sequenceNumber++
        });
      }
    } catch (error) {
      console.error('Error saving trade event:', error);
    }
  }

  private async handlePortfolioEvent(backtestId: string, portfolioEvent: ApiPortfolioEvent, sequenceNumber: number): Promise<void> {
    try {
      for (const portfolio of portfolioEvent.portfolio) {
        await this.backtestService.saveBacktestPortfolio({
          backtestId,
          positions: portfolio.positions.map(pos => ({
            asset: pos.asset,
            amount: pos.amount,
            avgPrice: pos.avgPrice,
            currentPrice: pos.currentPrice,
            value: pos.value,
            pnl: pos.pnl
          })),
          totalValue: portfolio.totalValue,
          weights: portfolio.weights,
          realizedPnL: portfolio.realizedPnL,
          riskMetrics: {
            volatility: portfolio.riskMetrics.volatility,
            exposure: portfolio.riskMetrics.exposure
          },
          timestamp: new Date(),
          sequenceNumber: sequenceNumber++
        });
      }
    } catch (error) {
      console.error('Error saving portfolio event:', error);
    }
  }
}


