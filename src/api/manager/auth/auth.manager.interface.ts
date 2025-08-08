import { VerifyTokenRequest, VerifyTokenResponse, GetCurrentUserRequest, GetCurrentUserResponse } from './auth.contracts';

export interface IAuthManager {
  verifyToken(request: VerifyTokenRequest): Promise<VerifyTokenResponse>;
  getCurrentUser(request: GetCurrentUserRequest): Promise<GetCurrentUserResponse>;
} 