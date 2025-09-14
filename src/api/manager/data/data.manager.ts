import { z } from 'zod';
import { IDataManager } from './data.manager.interface';
import { GetKlinesRequest, GetKlinesResponse, Candlestick } from './data.contracts';
import { ApiError, ApiResponse } from '@shared/http/api';
import { request } from 'undici';
import { parseTimestring } from '@shared/utils/time/time.utils';

// Validation schemas
const getKlinesSchema = z.object({
  baseAssets: z
    .array(z.string().min(1, 'Base asset cannot be empty'))
    .min(1, 'At least one base asset is required'),
  interval: z.string().min(1, 'Interval is required'),
});

export class DataManager implements IDataManager {
  async getKlines(getKlinesRequest: GetKlinesRequest): Promise<ApiResponse<GetKlinesResponse>> {
    try {
      console.log('getKlinesRequest', getKlinesRequest);
      const validatedRequest = getKlinesSchema.parse(getKlinesRequest);

      // For now, return mock data - this will be replaced with actual service calls later
      const candlesticks: Record<string, Candlestick[]> = {};
      console.log('validatedRequest', validatedRequest);
      validatedRequest.interval = '1day'; // TODO add mapping;
      await Promise.all(
        validatedRequest.baseAssets.map(async (baseAsset) => {
          const startTime = Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 14) / 1000);
          const endTime = Math.floor(new Date().getTime() / 1000);
          const response = await request(
            `https://api.kucoin.com/api/v1/market/candles?type=${validatedRequest.interval}&symbol=${baseAsset}-USDT&startAt=${startTime}&endAt=${endTime}`,
          );
          const body = (await response.body.json()) as any;
          console.log('body', body);
          candlesticks[baseAsset] = body.data?.map((data: any) => ({
            baseAsset,
            quoteAsset: 'USDT',
            openTime: new Date(Number(data[0]) * 1000).toISOString(),
            open: Number(data[1]),
            high: Number(data[3]),
            low: Number(data[4]),
            close: Number(data[2]),
            volume: Number(data[6]),
            closeTime: new Date(
              Number(data[0]) * 1000 + parseTimestring(validatedRequest.interval) * 1000,
            ).toISOString(),
            quoteAssetVolume: 0,
            numberOfTrades: 0,
            takerBuyBaseAssetVolume: 0,
            takerBuyQuoteAssetVolume: 0,
          }));
        }),
      );

      console.log('candlesticks', candlesticks);

      return ApiResponse({
        candlesticks,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiError('Validation failed: ' + error.errors.map((e) => e.message).join(', '), 400);
      }
      console.log('error', error);
      return ApiError('Failed to get klines data', 500);
    }
  }
}
