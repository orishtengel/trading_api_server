export interface ApiResponse<T = any> {
  status: number;
  data?: T;
  error?: string;
}

export function ApiSuccess<T>(data: T, status: number = 200): ApiResponse<T> {
  return {
    status,
    data
  };
}

export function ApiError(error: string, status: number = 400): ApiResponse {
  return {
    status,
    error
  };
} 