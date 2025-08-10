import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { buildCorsOptions } from '@shared/http/cors';
import { UsersRepository } from '@data/user/user.repository';
import { UsersService } from '@service/user/user.service';
import { UsersManager } from '@manager/user/user.manager';
import { UserController } from '@controller/user/user.controller';
import authRoutes from 'src/api/routes/auth.routes';
import botRoutes from 'src/api/routes/bot.routes';
import backtestRoutes from 'src/api/routes/backtest.routes';

const app = express();

// CORS configuration aligned with mock server (centralized)
const corsOptions = buildCorsOptions();
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

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

const port = process.env.PORT ? Number(process.env.PORT) : 52700;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on port ${port}`);
}); 