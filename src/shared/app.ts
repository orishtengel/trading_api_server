import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { buildCorsOptions } from '@shared/http/cors';
import { swaggerSpec } from '@shared/swagger';
import { UsersRepository } from '@data/user/user.repository';
import { UsersService } from '@service/user/user.service';
import { UsersManager } from '@manager/user/user.manager';
import { UserController } from '@controller/user/user.controller';
import authRoutes from '../api/routes/auth.routes';
import botRoutes from '../api/routes/bot.routes';
import backtestRoutes from '../api/routes/backtest.routes';

export function createApp() {
  const app = express();

  // CORS configuration aligned with mock server (centralized)
  const corsOptions = buildCorsOptions();
  app.use(cors(corsOptions));

  app.use(express.json());
  app.use(cookieParser());

  // Swagger documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Trading API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  }));

  // Swagger JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Root endpoint redirects to API documentation
  app.get('/', (req, res) => {
    res.redirect('/api-docs');
  });

  // Auth routes
  app.use(authRoutes);

  // Bot routes (now mounted under /api/user)
  app.use(botRoutes);

  // Backtest routes (SSE endpoint)
  app.use('/api/user', backtestRoutes);

  // User routes (for user-specific operations)
  const usersRepository = new UsersRepository();
  const usersService = new UsersService(usersRepository);
  const usersManager = new UsersManager(usersService);
  const userController = new UserController(usersManager);
  app.use('/api/users', userController.getRouter());

  return app;
}
