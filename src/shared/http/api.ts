export interface ApiResponse<T = any> {
  status: number;
  data?: T;
  error?: string;
}


export function ApiResponse<T>(data: T, status: number = 200, error?: string): ApiResponse<T> {
  return {
    status,
    data,
    error
  };
} 

export function ApiError(error: string, status: number = 400): ApiResponse {
  return {
    status,
    error
  };
} 

export function ApiSuccess<T>(data: T, status: number = 200): ApiResponse<T> {
  return {
    status,
    data
  };
} 