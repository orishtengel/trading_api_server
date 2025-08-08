export interface GetCurrentUserRequest {
  uid: string;
}

export interface GetCurrentUserResponse {
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