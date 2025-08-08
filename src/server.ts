import 'dotenv/config';
import express from 'express';
import { UsersRepository } from '@data/user/user.repository';
import { UsersService } from '@service/user/user.service';
import { UsersManager } from '@manager/user/user.manager';
import { UserController } from '@controller/user/user.controller';

const app = express();
app.use(express.json());

const usersRepository = new UsersRepository();
const usersService = new UsersService(usersRepository);
const usersManager = new UsersManager(usersService);
const userController = new UserController(usersManager);
app.use('/users', userController.router);

const port = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on port ${port}`);
}); 