import { Bot } from '@service/bot/bot.models';

// Constants
import dotenv from 'dotenv';
dotenv.config();

const QUOTE_ASSET = 'USDT' as const;
const RABBITMQ_URL = 'amqp://localhost' as const;
const OLLAMA_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:11434'
    : ('http://ollama:11434' as const);
const DEFAULT_MODEL = 'qwen3:0.6b' as const;

interface YamlDataSource {
  name: string;
  id: string;
  type: string;
  config: {
    baseAsset: string;
    quoteAsset: string;
    interval: string;
  };
}

interface YamlAgent {
  tools?: string[];
  name: string;
  id: string;
  type: string;
  inputChannels: string[];
  prompt: string;
  systemPrompt: string;
  model: string;
  config: {
    ollamaUrl: string;
  };
}

interface YamlPortfolio {
  riskManagementAgent: {
    policy: {
      maxVolatility: number;
      maxExposurePerAsset: Record<string, number>;
    };
    model: string;
    type: string;
    config: {
      ollamaUrl: string;
    };
  };
}

interface YamlCortex {
  inputChannels: string[];
}

interface YamlConfig {
  rabbitmqUrl: string;
  dataSources: YamlDataSource[];
  agents: YamlAgent[];
  portfolio: YamlPortfolio;
  cortex: YamlCortex;
}

export function mapBotToYaml(bot: Bot): YamlConfig {
  const { configuration } = bot;

  // Create a mapping from original data source IDs to new data source IDs
  const dataSourceIdMapping = new Map<string, string[]>();

  // Map data sources to YAML format
  const dataSources: YamlDataSource[] = configuration.dataSources.flatMap((ds) => {
    if (ds.dataSourceType === 'kucoin') {
      const tokenSpecificIds = configuration.tokens.map((token) => ds.id + '-' + token);
      dataSourceIdMapping.set(ds.id, tokenSpecificIds);

      return configuration.tokens.map((token, index) => {
        return {
          name: 'Binance KLines',
          id: ds.id + '-' + token,
          type: 'binance-klines',
          config: {
            baseAsset: token,
            quoteAsset: QUOTE_ASSET,
            interval: ds.timeframe || '12h',
          },
        };
      });
    } else {
      dataSourceIdMapping.set(ds.id, [ds.id]);
      return {
        name: ds.name,
        id: ds.id,
        type: 'binance-klines',
        config: {
          baseAsset: 'ETH',
          quoteAsset: QUOTE_ASSET,
          interval: ds.timeframe || '12h',
        },
      };
    }
  });

  // Map agents to YAML format with updated input channels
  const agents: YamlAgent[] = configuration.agents
    .filter((agent) => agent.type === 'agent')
    .map((agent) => ({
      name: agent.name,
      id: agent.id,
      type: 'ollama',
      tools: agent.tools,
      inputChannels: mapAgentInputChannels(agent.inputs, dataSourceIdMapping),
      prompt: agent.prompt || 'Analyze the current kline data',
      systemPrompt: generateSystemPrompt(agent.role),
      model: DEFAULT_MODEL, // agent.provider || DEFAULT_MODEL, TODO: restore
      config: {
        ollamaUrl: OLLAMA_URL,
      },
    }));

  // Build portfolio configuration
  const portfolio: YamlPortfolio = {
    riskManagementAgent: {
      policy: {
        maxVolatility: configuration.portfolio?.maxDrawdown || 0.05,
        maxExposurePerAsset: buildExposurePolicy(configuration.tokens),
      },
      model: DEFAULT_MODEL,
      type: 'ollama',
      config: {
        ollamaUrl: OLLAMA_URL,
      },
    },
  };

  // Build cortex configuration - use agent IDs as input channels
  const cortex: YamlCortex = {
    inputChannels: configuration.portfolio?.inputs || [],
  };

  return {
    rabbitmqUrl: RABBITMQ_URL,
    dataSources,
    agents,
    portfolio,
    cortex,
  };
}

function generateSystemPrompt(role: string): string {
  const basePrompt = 'Your are a crypto kline analyzer expert, predict what will happen next make sure to specify the time of the data, make sure to always include the asset you are predicting'

  switch (role) {
    case 'portfolio_optimizer':
      return `You are a professional cryptocurrency predictor, specializing in predicting based on the provided report. Your output should be in the form of RISE or FALL`;
    default:
      return basePrompt;
  }
}

function mapAgentInputChannels(
  originalInputs: string[],
  dataSourceIdMapping: Map<string, string[]>,
): string[] {
  const mappedInputs: string[] = [];

  originalInputs.forEach((inputId) => {
    if (dataSourceIdMapping.has(inputId)) {
      // If this input references a data source that was expanded,
      // include all the token-specific data source IDs
      const mappedIds = dataSourceIdMapping.get(inputId)!;
      mappedInputs.push(...mappedIds);
    } else {
      // If this input doesn't reference a data source that was expanded,
      // keep the original ID (could be referencing other agents, etc.)
      mappedInputs.push(inputId);
    }
  });

  return mappedInputs;
}

function buildExposurePolicy(tokens: string[]): Record<string, number> {
  const policy: Record<string, number> = {};

  // Always include USDT
  policy[QUOTE_ASSET] = 0.6;

  // Distribute remaining exposure among other tokens
  const otherTokens = tokens.filter((token) => token !== QUOTE_ASSET);
  const remainingExposure = 0.4;
  const exposurePerToken = otherTokens.length > 0 ? remainingExposure / otherTokens.length : 0;

  otherTokens.forEach((token) => {
    policy[token] = exposurePerToken;
  });

  // If no other tokens, give all exposure to a default asset
  if (otherTokens.length === 0) {
    policy['ETH'] = 0.4;
  }

  return policy;
}
