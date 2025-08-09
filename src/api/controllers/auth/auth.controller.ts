import { Request, Response } from 'express';
import { AuthManager } from '@manager/auth/auth.manager';
import { VerifyTokenRequest, GetCurrentUserRequest } from '@manager/auth/auth.contracts';
import { BaseController } from '@shared/controllers';

export class AuthController extends BaseController {
  private authManager: AuthManager;

  constructor() {
    super({
      enableLogging: true,
      enableAuth: false,
      loggingOptions: {
        redactFields: ['idToken'], // Redact sensitive token data
        extractUserId: (req) => req.params.uid || undefined
      }
    });
    
    this.authManager = new AuthManager();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.addRoute('post', '/verify-token', this.verifyToken);
    this.addRoute('get', '/user/:uid', this.getCurrentUser);
  }

  async verifyToken(req: Request, res: Response): Promise<void> {
    const request: VerifyTokenRequest = {
      idToken: req.body.idToken
    };

    const response = await this.authManager.verifyToken(request);
    console.log(response);
    res.status(response.status).json(response.data);
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    const request: GetCurrentUserRequest = {
      uid: req.params.uid || ''
    };

    const response = await this.authManager.getCurrentUser(request);
    res.status(response.status).json(response);
  }
} 