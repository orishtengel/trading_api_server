import { Request, Response } from 'express';
import { IUsersManager } from '@manager/user/user.manager.interface';
import { CreateUserRequest, UpdateUserRequest, GetUserByIdRequest, DeleteUserRequest } from '@manager/user/user.contracts';
import { BaseController } from '@shared/controllers';

export class UserController extends BaseController {
  constructor(private readonly usersManager: IUsersManager) {
    super({
      enableLogging: true,
      loggingOptions: {
        extractUserId: (req) => req.params.id || undefined
      }
    });
    
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.addRoute('get', '/:id', this.getById);
    this.addRoute('post', '/', this.create);
    this.addRoute('put', '/:id', this.update);
    this.addRoute('delete', '/:id', this.delete);
  }

  async getById(req: Request, res: Response) {
    const id = req.params.id || '';
    const result = await this.usersManager.getById(new GetUserByIdRequest(id));
    res.status(result.status).json(result.data ?? { error: result.error });
  }

  async create(req: Request, res: Response) {
    const { email, firstName, lastName, role, permissions = [] } = req.body;
    const result = await this.usersManager.create(new CreateUserRequest(email, firstName, lastName, role, permissions));
    res.status(result.status).json(result.data ?? { error: result.error });
  }

  async update(req: Request, res: Response) {
    const id = req.params.id || '';
    const { email, firstName, lastName, role, permissions } = req.body;
    const result = await this.usersManager.update(new UpdateUserRequest(id, email, firstName, lastName, role, permissions));
    res.status(result.status).json(result.data ?? { error: result.error });
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id || '';
    const result = await this.usersManager.delete(new DeleteUserRequest(id));
    res.status(result.status).json(result.data ?? { error: result.error });
  }

  public override getRouter() {
    return this.router;
  }
} 