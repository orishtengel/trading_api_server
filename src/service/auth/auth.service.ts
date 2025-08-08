import { adminAuth } from '@shared/firebase/firebase.admin.config';
import { AuthUser, VerifyTokenInput, AuthError } from './auth.models';
import { IAuthService } from './auth.service.interface';

export class AuthService implements IAuthService {
  async verifyIdToken(input: VerifyTokenInput): Promise<AuthUser> {
    try {
      const decodedToken = await adminAuth.verifyIdToken(input.idToken);
      const userRecord = await adminAuth.getUser(decodedToken.uid);
      
      return {
        uid: userRecord.uid,
        email: userRecord.email || null,
        emailVerified: userRecord.emailVerified,
        displayName: userRecord.displayName || null,
        photoURL: userRecord.photoURL || null,
        disabled: userRecord.disabled,
        customClaims: userRecord.customClaims
      };
    } catch (error: any) {
      const authError: AuthError = {
        code: error.code || 'auth/unknown-error',
        message: error.message || 'Unknown authentication error'
      };
      throw authError;
    }
  }

  async getUserById(uid: string): Promise<AuthUser> {
    try {
      const userRecord = await adminAuth.getUser(uid);
      
      return {
        uid: userRecord.uid,
        email: userRecord.email || null,
        emailVerified: userRecord.emailVerified,
        displayName: userRecord.displayName || null,
        photoURL: userRecord.photoURL || null,
        disabled: userRecord.disabled,
        customClaims: userRecord.customClaims
      };
    } catch (error: any) {
      const authError: AuthError = {
        code: error.code || 'auth/unknown-error',
        message: error.message || 'Unknown authentication error'
      };
      throw authError;
    }
  }
} 