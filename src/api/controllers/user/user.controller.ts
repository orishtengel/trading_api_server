import { Router, Request, Response } from 'express';
import { IUsersManager } from '@manager/user/user.manager.interface';
import { CreateUserRequest, UpdateUserRequest, GetUserByIdRequest, DeleteUserRequest } from '@manager/user/user.contracts';

export class UserController {
  public readonly router: Router;

  constructor(private readonly usersManager: IUsersManager) {
    this.router = Router();
    this.router.get('/:id', this.getById.bind(this));
    this.router.post('/', this.create.bind(this));
    this.router.put('/:id', this.update.bind(this));
    this.router.delete('/:id', this.delete.bind(this));
  }

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = await this.usersManager.getById(new GetUserByIdRequest(id));
    res.status(result.status).json(result.data ?? { error: result.error });
  }

  async create(req: Request, res: Response) {
    const { email, firstName, lastName, role, permissions = [] } = req.body;
    const result = await this.usersManager.create(new CreateUserRequest(email, firstName, lastName, role, permissions));
    res.status(result.status).json(result.data ?? { error: result.error });
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { email, firstName, lastName, role, permissions } = req.body;
    const result = await this.usersManager.update(new UpdateUserRequest(id, email, firstName, lastName, role, permissions));
    res.status(result.status).json(result.data ?? { error: result.error });
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = await this.usersManager.delete(new DeleteUserRequest(id));
    res.status(result.status).json(result.data ?? { error: result.error });
  }
} 