import { z } from 'zod';
import { AuthService } from '@service/auth/auth.service';
import { IAuthManager } from './auth.manager.interface';
import { VerifyTokenRequest, VerifyTokenResponse, GetCurrentUserRequest, GetCurrentUserResponse } from './auth.contracts';
import { ApiSuccess, ApiError } from '@shared/http/api';

const verifyTokenSchema = z.object({
  idToken: z.string().min(1, 'ID token is required')
});

const getCurrentUserSchema = z.object({
  uid: z.string().min(1, 'User ID is required')
});

export class AuthManager implements IAuthManager {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async verifyToken(request: VerifyTokenRequest): Promise<VerifyTokenResponse> {
    try {
      // Validate input
      const validatedInput = verifyTokenSchema.parse(request);
      
      // Call service
      const authUser = await this.authService.verifyIdToken({
        idToken: validatedInput.idToken
      });

      // Return success response
      return ApiSuccess({
        user: {
          uid: authUser.uid,
          email: authUser.email,
          emailVerified: authUser.emailVerified,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL,
          disabled: authUser.disabled,
          customClaims: authUser.customClaims
        }
      });
    } catch (error: any) {
      console.log(error);
      if (error instanceof z.ZodError) {
        return ApiError('Invalid input: ' + error.errors.map(e => e.message).join(', '), 400);
      }
      
      // Handle Firebase auth errors
      if (error.code) {
        const statusCode = this.getStatusFromAuthError(error.code);
        return ApiError(error.message, statusCode);
      }
      
      return ApiError('Internal server error', 500);
    }
  }

  async getCurrentUser(request: GetCurrentUserRequest): Promise<GetCurrentUserResponse> {
    try {
      // Validate input
      const validatedInput = getCurrentUserSchema.parse(request);
      
      // Call service
      const authUser = await this.authService.getUserById(validatedInput.uid);

      // Return success response
      return ApiSuccess({
        user: {
          uid: authUser.uid,
          email: authUser.email,
          emailVerified: authUser.emailVerified,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL,
          disabled: authUser.disabled,
          customClaims: authUser.customClaims
        }
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return ApiError('Invalid input: ' + error.errors.map(e => e.message).join(', '), 400);
      }
      
      // Handle Firebase auth errors
      if (error.code) {
        const statusCode = this.getStatusFromAuthError(error.code);
        return ApiError(error.message, statusCode);
      }
      
      return ApiError('Internal server error', 500);
    }
  }

  private getStatusFromAuthError(errorCode: string): number {
    switch (errorCode) {
      case 'auth/id-token-expired':
      case 'auth/id-token-revoked':
      case 'auth/invalid-id-token':
        return 401;
      case 'auth/user-not-found':
        return 404;
      case 'auth/user-disabled':
        return 403;
      default:
        return 400;
    }
  }
} 