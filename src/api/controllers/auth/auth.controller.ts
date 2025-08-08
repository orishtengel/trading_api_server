import { Request, Response } from 'express';
import { AuthManager } from '@manager/auth/auth.manager';
import { VerifyTokenRequest, GetCurrentUserRequest } from '@manager/auth/auth.contracts';

export class AuthController {
  private authManager: AuthManager;

  constructor() {
    this.authManager = new AuthManager();
  }

  async verifyToken(req: Request, res: Response): Promise<void> {
    const request: VerifyTokenRequest = {
      idToken: req.body.idToken
    };

    const response = await this.authManager.verifyToken(request);
    res.status(response.status).json(response);
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    const request: GetCurrentUserRequest = {
      uid: req.params.uid || ''
    };

    const response = await this.authManager.getCurrentUser(request);
    res.status(response.status).json(response);
  }
} 