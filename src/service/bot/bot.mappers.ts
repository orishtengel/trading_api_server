import { BotEntity, AgentEntity, AIAgentEntity, PortfolioEntity, CurrencyEntity, DataSourceEntity, ExecuterEntity } from '@data/bot/bot.entities';
import { Bot, Agent, AIAgent, Portfolio, Currency, DataSource, Executer, CreateBotInput, UpdateBotInput } from './bot.models';
import { CreateBotRequest, UpdateBotRequest } from '@data/bot/contracts/requestResponse';

// Map BotEntity to Bot domain model
export function mapBotEntityToBot(entity: BotEntity): Bot {
  return {
    id: entity.id,
    name: entity.name,
    userId: entity.userId,
    tokens: entity.tokens,
    status: entity.status,
    timeframe: entity.timeframe,
    agents: entity.agents.map(mapAgentEntityToAgent),
    createdAt: new Date(entity.createdAt),
    updatedAt: new Date(entity.updatedAt)
  };
}

// Map AgentEntity union to Agent domain model
export function mapAgentEntityToAgent(entity: AgentEntity): Agent {
  switch (entity.type) {
    case 'agent':
      return mapAIAgentEntityToAIAgent(entity as AIAgentEntity);
    case 'portfolio':
      return mapPortfolioEntityToPortfolio(entity as PortfolioEntity);
    case 'currency':
      return mapCurrencyEntityToCurrency(entity as CurrencyEntity);
    case 'data':
      return mapDataSourceEntityToDataSource(entity as DataSourceEntity);
    case 'executer':
      return mapExecuterEntityToExecuter(entity as ExecuterEntity);
    default:
      throw new Error(`Unknown agent type: ${(entity as any).type}`);
  }
}

// Individual agent mappers
function mapAIAgentEntityToAIAgent(entity: AIAgentEntity): AIAgent {
  return {
    id: entity.id,
    name: entity.name,
    type: 'agent',
    inputs: entity.inputs,
    positions: entity.positions,
    configuration: entity.configuration
  };
}

function mapPortfolioEntityToPortfolio(entity: PortfolioEntity): Portfolio {
  return {
    id: entity.id,
    name: entity.name,
    type: 'portfolio',
    inputs: entity.inputs,
    positions: entity.positions,
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
    positions: entity.positions,
    selectedToken: entity.selectedToken
  };
}

function mapDataSourceEntityToDataSource(entity: DataSourceEntity): DataSource {
  return {
    id: entity.id,
    name: entity.name,
    type: 'data',
    inputs: entity.inputs,
    positions: entity.positions,
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
    positions: entity.positions,
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
    tokens: input.tokens,
    status: input.status,
    timeframe: input.timeframe,
    agents: input.agents.map(mapAgentToAgentEntity)
  };
}

export function mapUpdateBotInputToUpdateBotRequest(input: UpdateBotInput): UpdateBotRequest {
  return {
    id: input.id,
    name: input.name,
    tokens: input.tokens,
    status: input.status,
    timeframe: input.timeframe,
    agents: input.agents?.map(mapAgentToAgentEntity),
    userId: input.userId
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
        positions: agent.positions,
        configuration: agent.configuration
      } as AIAgentEntity;
    case 'portfolio':
      return {
        id: agent.id,
        name: agent.name,
        type: 'portfolio',
        inputs: agent.inputs,
        positions: agent.positions,
        riskLevel: agent.riskLevel,
        rebalanceFrequency: agent.rebalanceFrequency,
        stopLoss: agent.stopLoss,
        takeProfit: agent.takeProfit,
        maxDrawdown: agent.maxDrawdown,
        targetReturn: agent.targetReturn
      } as PortfolioEntity;
    case 'currency':
      return {
        id: agent.id,
        name: agent.name,
        type: 'currency',
        inputs: agent.inputs,
        positions: agent.positions,
        selectedToken: agent.selectedToken
      } as CurrencyEntity;
    case 'data':
      return {
        id: agent.id,
        name: agent.name,
        type: 'data',
        inputs: agent.inputs,
        positions: agent.positions,
        dataSourceType: agent.dataSourceType,
        marketType: agent.marketType,
        timeframe: agent.timeframe,
        sources: agent.sources,
        accounts: agent.accounts
      } as DataSourceEntity;
    case 'executer':
      return {
        id: agent.id,
        name: agent.name,
        type: 'executer',
        inputs: agent.inputs,
        positions: agent.positions,
        exchange: agent.exchange,
        apiKeyId: agent.apiKeyId,
        configuration: agent.configuration
      } as ExecuterEntity;
    default:
      throw new Error(`Unknown agent type: ${(agent as any).type}`);
  }
} 