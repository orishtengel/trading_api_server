import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { UsersRepository } from '@data/user/user.repository';
import { UsersService } from '@service/user/user.service';
import { UsersManager } from '@manager/user/user.manager';
import { UserController } from '@controller/user/user.controller';
import authRoutes from './api/routes/auth.routes';
import botRoutes from './api/routes/bot.routes';

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());

// Auth routes
app.use(authRoutes);

// Bot routes
app.use(botRoutes);


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