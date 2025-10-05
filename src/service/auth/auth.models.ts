export interface AuthUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
  disabled: boolean;
  customClaims?: Record<string, any>;
}

export interface VerifyTokenInput {
  idToken: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface RefreshTokenResult {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}
