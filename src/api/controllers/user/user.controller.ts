import { Request, Response } from 'express';
import { IUsersManager } from '@manager/user/user.manager.interface';
import { CreateUserRequest, UpdateUserRequest, GetUserByIdRequest, DeleteUserRequest } from '@manager/user/user.contracts';
import { BaseController } from '@shared/controllers';
import { AuthenticatedRequest } from '@shared/middleware/auth.middleware';

export class UserController extends BaseController {
  constructor(private readonly usersManager: IUsersManager) {
    super({
      enableLogging: true,
      loggingOptions: {
        extractUserId: (req) => req.params.id || undefined
      },
    });
    
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.addRoute('get', '/:id', this.getById);
    this.addRoute('post', '/', this.create);
    this.addRoute('put', '/:id', this.update);
    this.addRoute('delete', '/:id', this.delete);
  }

  async getById(req: AuthenticatedRequest, res: Response) {
    const id = req.params.id || '';
    const result = await this.usersManager.getById(new GetUserByIdRequest(id));
    res.status(result.status).json(result.data ?? { error: result.error });
  }

  async create(req: AuthenticatedRequest, res: Response) {
    const { email, firstName, lastName, role, permissions = [] } = req.body;
    const userId = req.user?.uid;
    
    if (!userId) {
      res.status(401).json({ error: 'User must be authenticated to create user' });
      return;
    }
    
    const result = await this.usersManager.create(new CreateUserRequest(userId, email, firstName, lastName, role, permissions));
    res.status(result.status).json(result.data ?? { error: result.error });
  }

  async update(req: AuthenticatedRequest, res: Response) {
    const id = req.params.id || '';
    const { firstName, lastName, role, permissions } = req.body;
    const result = await this.usersManager.update(new UpdateUserRequest(id, firstName, lastName, role, permissions));
    res.status(result.status).json(result.data ?? { error: result.error });
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    const id = req.params.id || '';
    const result = await this.usersManager.delete(new DeleteUserRequest(id));
    res.status(result.status).json(result.data ?? { error: result.error });
  }

  public override getRouter() {
    return this.router;
  }
} 