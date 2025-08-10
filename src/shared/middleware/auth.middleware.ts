import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@service/auth/auth.service';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string | null;
    emailVerified: boolean;
    displayName: string | null;
    photoURL: string | null;
    disabled: boolean;
    customClaims?: Record<string, any>;
  };
}

export class AuthMiddleware {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const cookieToken = (req as any).cookies?.idToken || (req as any).cookies?.token;
      // Support token via query param for transports that cannot set headers (e.g., EventSource)
      const queryTokenRaw = (req.query?.idToken ?? req.query?.token) as unknown as string | string[] | undefined;
      const queryToken = Array.isArray(queryTokenRaw) ? queryTokenRaw[0] : queryTokenRaw;

      let idToken: string | undefined;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        idToken = authHeader.substring(7);
      } else if (cookieToken) {
        idToken = cookieToken;
      } else if (queryToken) {
        idToken = queryToken;
      }

      if (!idToken) {
        res.status(401).json({ error: 'ID token is required' });
        return;
      }

      // Verify the token using AuthService
      const user = await this.authService.verifyIdToken({ idToken });
      
      // Add user info to request object
      req.user = user;
      
      next();
    } catch (error: any) {
      let statusCode = 401;
      let message = 'Authentication failed';

      if (error.code) {
        switch (error.code) {
          case 'auth/id-token-expired':
            message = 'ID token has expired';
            break;
          case 'auth/id-token-revoked':
            message = 'ID token has been revoked';
            break;
          case 'auth/invalid-id-token':
            message = 'Invalid ID token';
            break;
          case 'auth/user-not-found':
            statusCode = 404;
            message = 'User not found';
            break;
          case 'auth/user-disabled':
            statusCode = 403;
            message = 'User account has been disabled';
            break;
          default:
            message = error.message || 'Authentication failed';
        }
      }

      res.status(statusCode).json({ error: message });
    }
  };

  // Optional middleware that sets user if token is present but doesn't require it
  optionalAuthenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    // Allow CORS preflight requests to pass through
    if (req.method === 'OPTIONS') {
      next();
      return;
    }
    try {
      const authHeader = req.headers.authorization;
      const cookieToken = (req as any).cookies?.idToken || (req as any).cookies?.token;
      const queryTokenRaw = (req.query?.idToken ?? req.query?.token) as unknown as string | string[] | undefined;
      const queryToken = Array.isArray(queryTokenRaw) ? queryTokenRaw[0] : queryTokenRaw;

      let idToken: string | undefined;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        idToken = authHeader.substring(7);
      } else if (cookieToken) {
        idToken = cookieToken;
      } else if (queryToken) {
        idToken = queryToken;
      }

      if (!idToken) {
        next();
        return;
      }

      // Try to verify the token
      const user = await this.authService.verifyIdToken({ idToken });
      req.user = user;
      
      next();
    } catch (error) {
      // For optional auth, we don't fail on invalid tokens, just continue without user
      next();
    }
  };
} 