export interface VerifyTokenRequest {
  idToken: string;
}

export interface VerifyTokenResponse {
  status: number;
  data?: {
    user: {
      uid: string;
      email: string | null;
      emailVerified: boolean;
      displayName: string | null;
      photoURL: string | null;
      disabled: boolean;
      customClaims?: Record<string, any>;
    };
  };
  error?: string;
} 