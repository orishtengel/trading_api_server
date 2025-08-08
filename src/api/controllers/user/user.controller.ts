import { Router, Request, Response } from 'express';
import { IUsersManager } from '@manager/user/user.manager.interface';
import { CreateUserRequest, UpdateUserRequest } from '@manager/user/user.contracts';

export class UserController {
  public readonly router: Router;

  constructor(private readonly usersManager: IUsersManager) {
    this.router = Router();
    this.router.get('/', this.list.bind(this));
    this.router.get('/:id', this.getById.bind(this));
    this.router.post('/', this.create.bind(this));
    this.router.put('/:id', this.update.bind(this));
    this.router.delete('/:id', this.delete.bind(this));
  }

  async list(req: Request, res: Response) {
    const result = await this.usersManager.list();
    res.status(result.status).json(result.data ?? { error: result.error });
  }

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = await this.usersManager.getById({ id });
    res.status(result.status).json(result.data ?? { error: result.error });
  }

  async create(req: Request, res: Response) {
    const body = req.body as CreateUserRequest;
    const result = await this.usersManager.create(body);
    res.status(result.status).json(result.data ?? { error: result.error });
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const body = req.body as Omit<UpdateUserRequest, 'id'>;
    const result = await this.usersManager.update({ id, ...body });
    res.status(result.status).json(result.data ?? { error: result.error });
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = await this.usersManager.delete({ id });
    res.status(result.status).json(result.data ?? { error: result.error });
  }
} 