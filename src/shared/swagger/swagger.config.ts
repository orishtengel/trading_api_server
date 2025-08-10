import swaggerJsdoc from 'swagger-jsdoc';
import { Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trading API Server',
      version: '0.1.0',
      description: 'Trading platform API server with layered architecture (controller -> manager -> service -> data)',
      contact: {
        name: 'Trading API Support',
        url: 'https://github.com/your-org/trading_api_server',
      },
    },
    servers: [
      {
        url: 'http://localhost:52700',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Firebase ID Token',
        },
      },
      schemas: {
        // Common response schemas
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
          required: ['error'],
        },
        
        // Auth schemas
        VerifyTokenRequest: {
          type: 'object',
          properties: {
            idToken: {
              type: 'string',
              description: 'Firebase ID token',
            },
          },
          required: ['idToken'],
        },
        
        VerifyTokenResponse: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                uid: { type: 'string' },
                email: { type: 'string', nullable: true },
                emailVerified: { type: 'boolean' },
                displayName: { type: 'string', nullable: true },
                photoURL: { type: 'string', nullable: true },
                disabled: { type: 'boolean' },
                customClaims: { 
                  type: 'object',
                  additionalProperties: true,
                },
              },
              required: ['uid', 'emailVerified', 'disabled'],
            },
          },
          required: ['user'],
        },
        
        // Bot schemas
        BotConfiguration: {
          type: 'object',
          properties: {
            strategy: { type: 'string' },
            parameters: { 
              type: 'object',
              additionalProperties: true,
            },
            riskSettings: {
              type: 'object',
              properties: {
                maxPositionSize: { type: 'number' },
                stopLoss: { type: 'number' },
                takeProfit: { type: 'number' },
              },
            },
          },
          required: ['strategy'],
        },
        
        BotStatus: {
          type: 'string',
          enum: ['active', 'inactive', 'paused', 'error', 'backtesting'],
        },
        
        CreateBotRequest: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            status: { $ref: '#/components/schemas/BotStatus' },
            configuration: { $ref: '#/components/schemas/BotConfiguration' },
          },
          required: ['name', 'status', 'configuration'],
        },
        
        Bot: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            userId: { type: 'string' },
            status: { $ref: '#/components/schemas/BotStatus' },
            configuration: { $ref: '#/components/schemas/BotConfiguration' },
            createdAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'ISO 8601 timestamp',
            },
            updatedAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'ISO 8601 timestamp',
            },
          },
          required: ['id', 'name', 'userId', 'status', 'configuration', 'createdAt', 'updatedAt'],
        },
        
        UpdateBotRequest: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            status: { $ref: '#/components/schemas/BotStatus' },
            configuration: { $ref: '#/components/schemas/BotConfiguration' },
          },
        },
        
        // User schemas
        CreateUserRequest: {
          type: 'object',
          properties: {
            uid: { type: 'string' },
            email: { type: 'string', format: 'email' },
            displayName: { type: 'string' },
          },
          required: ['uid', 'email'],
        },
        
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            uid: { type: 'string' },
            email: { type: 'string', format: 'email' },
            displayName: { type: 'string' },
            createdAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'ISO 8601 timestamp',
            },
            updatedAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'ISO 8601 timestamp',
            },
          },
          required: ['id', 'uid', 'email', 'createdAt', 'updatedAt'],
        },
        
        UpdateUserRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            displayName: { type: 'string' },
          },
        },
        
        // Backtest schemas
        RunBacktestRequest: {
          type: 'object',
          properties: {
            startDate: { 
              type: 'string', 
              format: 'date-time',
              description: 'Start date in ISO 8601 format',
            },
            endDate: { 
              type: 'string', 
              format: 'date-time',
              description: 'End date in ISO 8601 format',
            },
          },
          required: ['startDate', 'endDate'],
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [
    './src/api/controllers/**/*.ts',
    './src/shared/swagger/paths/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
