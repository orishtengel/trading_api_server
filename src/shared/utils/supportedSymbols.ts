import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

interface SupportedSymbolData {
  symbol: string;
  name: string;
  baseCurrency: string;
  quoteCurrency: string;
  feeCurrency: string;
  market: string;
  baseMinSize: string;
  quoteMinSize: string;
  baseMaxSize: string;
  quoteMaxSize: string;
  baseIncrement: string;
  quoteIncrement: string;
  priceIncrement: string;
  priceLimitRate: string;
  minFunds: string;
  isMarginEnabled: boolean;
  enableTrading: boolean;
  feeCategory: number;
  makerFeeCoefficient: string;
  takerFeeCoefficient: string;
  st: boolean;
  callauctionIsEnabled: boolean;
  callauctionPriceFloor: string | null;
  callauctionPriceCeiling: string | null;
  callauctionFirstStageStartTime: number | null;
  callauctionSecondStageStartTime: number | null;
  callauctionThirdStageStartTime: number | null;
  tradingStartTime: number | null;
}

export interface FilteredSupportedSymbol {
  symbol: string;
  binanceSymbol: string;
  quoteCurrency: string;
  baseCurrency: string;
}

const SUPPORTED_TOKENS_COUNT = 20;
const KUCOIN_SYMBOLS_API = 'https://api.kucoin.com/api/v2/symbols';

async function fetchAndSaveSupportedSymbols(): Promise<void> {
  try {
    console.log('Fetching data from KuCoin API...');
    const response = await axios.get(KUCOIN_SYMBOLS_API);
    
    if (response.data && response.data.code === '200000' && response.data.data) {
      const symbols: SupportedSymbolData[] = response.data.data.filter((token: any) => token.quoteCurrency === 'USDT' && token.enableTrading === true).map((token: any) => ({
        symbol: token.symbol,
        binanceSymbol: `${token.baseCurrency}${token.quoteCurrency}`,
        quoteCurrency: token.quoteCurrency,
        baseCurrency: token.baseCurrency,
      }));
      
      // Write the raw data to the JSON file
      const jsonPath = path.join(__dirname, '../../data/staticData/supportedTokens.json');
      fs.writeFileSync(jsonPath, JSON.stringify(symbols, null, 2), 'utf8');
      
      console.log(`Successfully fetched and saved ${symbols.length} symbols to ${jsonPath}`);
    } else {
      throw new Error('Invalid response format from KuCoin API');
    }
  } catch (error) {
    console.error('Error fetching supported tokens from API:', error);
    throw error;
  }
}

function loadSupportedSymbols(): FilteredSupportedSymbol[] {
  try {
    // Read the JSON file
    const jsonPath = path.join(__dirname, '../../data/staticData/supportedSymbols.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const symbols: FilteredSupportedSymbol[] = JSON.parse(jsonData);    

    console.log('symbols loaded', symbols.length);
    return symbols;
  } catch (error) {
    console.error('Error loading supported tokens:', error);
    return [];
  }
}

// Export the functions and constant
export { loadSupportedSymbols, fetchAndSaveSupportedSymbols, SUPPORTED_TOKENS_COUNT };

async function main() {
  await fetchAndSaveSupportedSymbols();
}

// main();