import { BotEntity, BotConfigurationEntity, AgentEntity, AIAgentEntity, PortfolioEntity, CurrencyEntity, DataSourceEntity, ExecuterEntity } from '@data/bot/bot.entities';
import { Bot, BotConfiguration, Agent, Portfolio, Currency, DataSource, Executer, CreateBotInput, UpdateBotInput } from './bot.models';
import { CreateBotRequest, UpdateBotRequest } from '@data/bot/contracts/requestResponse';

// Map BotEntity to Bot domain model
export function mapBotEntityToBot(entity: BotEntity): Bot {
  return {
    id: entity.id,
    name: entity.name,
    userId: entity.userId,
    status: entity.status,
    configuration: mapBotConfigurationEntityToBotConfiguration(entity.configuration)
  };
}

// Map BotConfigurationEntity to BotConfiguration domain model
export function mapBotConfigurationEntityToBotConfiguration(entity: BotConfigurationEntity): BotConfiguration {
  return {
    tokens: entity.tokens,
    dataSources: entity.dataSources.map(mapDataSourceEntityToDataSource),
    executer: entity.executer ? mapExecuterEntityToExecuter(entity.executer) : null,
    portfolio: entity.portfolio ? mapPortfolioEntityToPortfolio(entity.portfolio) : null,
    agents: entity.agents.map(mapAgentEntityToAgent)
  };
}

// Map AgentEntity union to Agent domain model
export function mapAgentEntityToAgent(entity: AgentEntity): Agent {
  switch (entity.type) {
    case 'agent':
      return mapAIAgentEntityToAIAgent(entity as AIAgentEntity);
    default:
      throw new Error(`Unknown agent type: ${(entity as any).type}`);
  }
}

// Individual agent mappers
function mapAIAgentEntityToAIAgent(entity: AIAgentEntity): Agent {
  return {
    id: entity.id,
    name: entity.name,
    type: 'agent',
    inputs: entity.inputs,
    coordinates: entity.coordinates,
    provider: entity.configuration.provider,
    role: entity.configuration.role,
    prompt: entity.configuration.prompt,
    apiKey: entity.configuration.apiKey
  };
}

function mapPortfolioEntityToPortfolio(entity: PortfolioEntity): Portfolio {
  return {
    id: entity.id,
    name: entity.name,
    type: 'portfolio',
    inputs: entity.inputs,
    coordinates: entity.coordinates,
    riskLevel: entity.riskLevel,
    rebalanceFrequency: entity.rebalanceFrequency,
    stopLoss: entity.stopLoss,
    takeProfit: entity.takeProfit,
    maxDrawdown: entity.maxDrawdown,
    targetReturn: entity.targetReturn
  };
}

function mapCurrencyEntityToCurrency(entity: CurrencyEntity): Currency {
  return {
    id: entity.id,
    name: entity.name,
    type: 'currency',
    inputs: entity.inputs,
    coordinates: entity.coordinates,
    selectedToken: entity.selectedToken
  };
}

function mapDataSourceEntityToDataSource(entity: DataSourceEntity): DataSource {
  return {
    id: entity.id,
    name: entity.name,
    type: 'data',
    inputs: entity.inputs,
    coordinates: entity.coordinates,
    dataSourceType: entity.dataSourceType,
    marketType: entity.marketType,
    timeframe: entity.timeframe,
    sources: entity.sources,
    accounts: entity.accounts
  };
}

function mapExecuterEntityToExecuter(entity: ExecuterEntity): Executer {
  return {
    id: entity.id,
    name: entity.name,
    type: 'executer',
    inputs: entity.inputs,
    coordinates: entity.coordinates,
    exchange: entity.exchange,
    apiKeyId: entity.apiKeyId,
    configuration: entity.configuration
  };
}

// Map domain input to data layer request
export function mapCreateBotInputToCreateBotRequest(input: CreateBotInput): CreateBotRequest {
  return {
    name: input.name,
    userId: input.userId,
    status: input.status,
    configuration: mapBotConfigurationToBotConfigurationEntity(input.configuration)
  };
}

export function mapUpdateBotInputToUpdateBotRequest(input: UpdateBotInput): UpdateBotRequest {
  return {
    id: input.id,
    name: input.name,
    status: input.status,
    configuration: input.configuration ? mapBotConfigurationToBotConfigurationEntity(input.configuration) : undefined,
    userId: input.userId
  };
}

// Map BotConfiguration to BotConfigurationEntity
export function mapBotConfigurationToBotConfigurationEntity(config: BotConfiguration): BotConfigurationEntity {
  return {
    tokens: config.tokens,
    dataSources: config.dataSources.map(mapDataSourceToDataSourceEntity),
    executer: config.executer ? mapExecuterToExecuterEntity(config.executer) : null,
    portfolio: config.portfolio ? mapPortfolioToPortfolioEntity(config.portfolio) : null,
    agents: config.agents.map(mapAgentToAgentEntity)
  };  
}

// Map DataSource domain model to DataSourceEntity
function mapDataSourceToDataSourceEntity(dataSource: DataSource): DataSourceEntity {
  return {
    id: dataSource.id,
    name: dataSource.name,
    type: 'data',
    inputs: dataSource.inputs,
    coordinates: dataSource.coordinates,
    dataSourceType: dataSource.dataSourceType,
    marketType: dataSource.marketType,
    timeframe: dataSource.timeframe,
    sources: dataSource.sources,
    accounts: dataSource.accounts
  };
}

// Map Executer domain model to ExecuterEntity
function mapExecuterToExecuterEntity(executer: Executer): ExecuterEntity {
  return {
    id: executer.id,
    name: executer.name,
    type: 'executer',
    inputs: executer.inputs,
    coordinates: executer.coordinates,
    exchange: executer.exchange,
    apiKeyId: executer.apiKeyId,
    configuration: executer.configuration
  };
}

// Map Portfolio domain model to PortfolioEntity
function mapPortfolioToPortfolioEntity(portfolio: Portfolio): PortfolioEntity {
  return {
    id: portfolio.id,
    name: portfolio.name,
    type: 'portfolio',
    inputs: portfolio.inputs,
    coordinates: portfolio.coordinates,
    riskLevel: portfolio.riskLevel,
    rebalanceFrequency: portfolio.rebalanceFrequency,
    stopLoss: portfolio.stopLoss,
    takeProfit: portfolio.takeProfit,
    maxDrawdown: portfolio.maxDrawdown,
    targetReturn: portfolio.targetReturn
  };
}

// Map Agent domain model to AgentEntity
function mapAgentToAgentEntity(agent: Agent): AgentEntity {
  switch (agent.type) {
    case 'agent':
      return {
        id: agent.id,
        name: agent.name,
        type: 'agent',
        inputs: agent.inputs,
        coordinates: agent.coordinates,
        configuration: {
          provider: agent.provider,
          role: agent.role,
          prompt: agent.prompt,
          apiKey: agent.apiKey
        }
      } as AIAgentEntity;
    default:
      throw new Error(`Unknown agent type: ${(agent as any).type}`);
  }
} 