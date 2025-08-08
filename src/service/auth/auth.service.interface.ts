import { AuthUser, VerifyTokenInput } from './auth.models';

export interface IAuthService {
  verifyIdToken(input: VerifyTokenInput): Promise<AuthUser>;
  getUserById(uid: string): Promise<AuthUser>;
} 