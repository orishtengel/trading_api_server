import { request } from 'undici';

export interface BinanceRollingWindowStats {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  lastPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export interface BinanceCurrentPrice {
  symbol: string;
  price: string;
  timestamp: number;
}

/**
 * Fetches rolling window price change statistics from Binance API for multiple symbols
 * @param symbols - Array of trading symbols (e.g., ['BTCUSDT', 'ETHUSDT'])
 * @param windowSize - The time window ('1d', '7d', '30d', etc.)
 * @returns Promise<BinanceRollingWindowStats[]>
 */
export async function fetchBinanceRollingWindowStats(
  symbols: string[], 
  windowSize: string
): Promise<BinanceRollingWindowStats[]> {
  try {
    if (windowSize === '1d') {
      // Use 24hr ticker endpoint for 1 day data
      const symbolsParam = JSON.stringify(symbols);
      const endpoint = `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(symbolsParam)}`;
      
      const response = await request(endpoint);
      const body = await response.body.json() as any;
      
      if (response.statusCode !== 200) {
        throw new Error(`Binance API error: ${body.msg || 'Unknown error'}`);
      }

      // Handle both single symbol (object) and multiple symbols (array) responses
      const dataArray = Array.isArray(body) ? body : [body];
      
      return dataArray.map((item: any) => ({
        symbol: item.symbol,
        priceChange: item.priceChange,
        priceChangePercent: item.priceChangePercent,
        weightedAvgPrice: item.weightedAvgPrice,
        openPrice: item.openPrice,
        highPrice: item.highPrice,
        lowPrice: item.lowPrice,
        lastPrice: item.lastPrice,
        volume: item.volume,
        quoteVolume: item.quoteVolume,
        openTime: item.openTime,
        closeTime: item.closeTime,
        firstId: item.firstId,
        lastId: item.lastId,
        count: item.count
      }));
    } else {
      // For 7d and 30d, calculate from klines data
      const results = await Promise.all(
        symbols.map(symbol => fetchRollingWindowFromKlines(symbol, windowSize))
      );
      return results;
    }
  } catch (error) {
    console.error(`Error fetching ${windowSize} data for symbols:`, symbols, error);
    throw error;
  }
}

/**
 * Fetches rolling window statistics by calculating from klines data
 * @param symbol - Trading symbol (e.g., 'BTCUSDT')
 * @param windowSize - The time window ('7d', '30d', etc.)
 * @returns Promise<BinanceRollingWindowStats>
 */
async function fetchRollingWindowFromKlines(
  symbol: string,
  windowSize: string
): Promise<BinanceRollingWindowStats> {
  const days = windowSize === '7d' ? 7 : windowSize === '30d' ? 30 : 1;
  const endTime = Date.now();
  const startTime = endTime - (days * 24 * 60 * 60 * 1000);
  
  const endpoint = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&startTime=${startTime}&endTime=${endTime}&limit=${days + 1}`;
  
  const response = await request(endpoint);
  const body = await response.body.json() as any;
  
  if (response.statusCode !== 200) {
    throw new Error(`Binance API error: ${body.msg || 'Unknown error'}`);
  }

  if (!Array.isArray(body) || body.length < 2) {
    throw new Error(`Insufficient klines data for ${symbol}`);
  }

  // Get current price from the latest kline
  const latestKline = body[body.length - 1];
  const oldestKline = body[0];
  
  const currentPrice = parseFloat(latestKline[4]); // Close price
  const oldPrice = parseFloat(oldestKline[1]); // Open price of oldest kline
  
  const priceChange = (currentPrice - oldPrice).toString();
  const priceChangePercent = (((currentPrice - oldPrice) / oldPrice) * 100).toString();
  
  // Calculate volume and other stats
  let totalVolume = 0;
  let totalQuoteVolume = 0;
  let high = 0;
  let low = Infinity;
  
  for (const kline of body) {
    const klineHigh = parseFloat(kline[2]);
    const klineLow = parseFloat(kline[3]);
    const klineVolume = parseFloat(kline[5]);
    const klineQuoteVolume = parseFloat(kline[7]);
    
    if (klineHigh > high) high = klineHigh;
    if (klineLow < low) low = klineLow;
    totalVolume += klineVolume;
    totalQuoteVolume += klineQuoteVolume;
  }
  
  return {
    symbol,
    priceChange,
    priceChangePercent,
    weightedAvgPrice: (totalQuoteVolume / totalVolume).toString(),
    openPrice: oldPrice.toString(),
    highPrice: high.toString(),
    lowPrice: low.toString(),
    lastPrice: currentPrice.toString(),
    volume: totalVolume.toString(),
    quoteVolume: totalQuoteVolume.toString(),
    openTime: parseInt(oldestKline[0]),
    closeTime: parseInt(latestKline[6]),
    firstId: 0, // Not available from klines
    lastId: 0, // Not available from klines
    count: body.length
  };
}

/**
 * Fetches rolling window price change statistics from Binance API for a single symbol
 * @param symbols - The trading symbol (e.g., 'BTCUSDT')
 * @param windowSize - The time window ('1d', '7d', '30d', etc.)
 * @returns Promise<BinanceRollingWindowStats>
 */
export async function fetchBinanceRollingWindowStatsSingle(
  symbols: string[], 
  windowSize: string
): Promise<BinanceRollingWindowStats[]> {
  const results = await fetchBinanceRollingWindowStats(symbols, windowSize);
  if (results.length === 0) {
    throw new Error(`No data returned for symbol ${symbols}`);
  }
  return results;
}

/**
 * Fetches current prices from Binance API for multiple symbols
 * @param symbols - Array of trading symbols (e.g., ['BTCUSDT', 'ETHUSDT'])
 * @returns Promise<BinanceCurrentPrice[]>
 */
export async function fetchBinanceCurrentPrices(symbols: string[]): Promise<BinanceCurrentPrice[]> {
  try {
    const symbolsParam = JSON.stringify(symbols);
    const response = await request(
      `https://api.binance.com/api/v3/ticker/price?symbols=${encodeURIComponent(symbolsParam)}`
    );
    
    const body = await response.body.json() as any;
    
    if (response.statusCode !== 200) {
      throw new Error(`Binance API error: ${body.msg || 'Unknown error'}`);
    }

    // Handle both single symbol (object) and multiple symbols (array) responses
    const dataArray = Array.isArray(body) ? body : [body];
    const timestamp = Date.now();
    
    return dataArray.map((item: any) => ({
      symbol: item.symbol,
      price: item.price,
      timestamp
    }));
  } catch (error) {
    console.error(`Error fetching current prices for symbols:`, symbols, error);
    throw error;
  }
}

/**
 * Fetches current price from Binance API for a single symbol
 * @param symbols - The trading symbol (e.g., 'BTCUSDT')
 * @returns Promise<BinanceCurrentPrice>
 */
export async function fetchBinanceCurrentPrice(symbols: string[]): Promise<BinanceCurrentPrice[]> {
  const results = await fetchBinanceCurrentPrices(symbols);
  if (results.length === 0) {
    throw new Error(`No price data returned for symbol ${symbols}`);
  }
  return results;
}
