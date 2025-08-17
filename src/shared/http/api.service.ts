import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ApiError, ApiSuccess } from './api';
import dotenv from 'dotenv';

dotenv.config();

export interface ApiServiceConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  params?: Record<string, any>;
}

export class ApiService {
  private client: AxiosInstance;

  constructor(config: ApiServiceConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000, // 30 seconds default
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      }
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[API] ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        if (error.response) {
          console.error(`[API] ${error.response.status} ${error.config?.url}:`, error.response.data);
        } else {
          console.error('[API] Network error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Handle axios errors and convert them to ApiResponse format
   */
  private handleError(error: AxiosError): ApiResponse {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const responseData = error.response.data as any;
      const message = responseData?.message || responseData?.error || error.message;
      return ApiError(message, status);
    } else if (error.request) {
      // Request was made but no response received
      return ApiError('Network error: No response from server', 503);
    } else {
      // Something else happened
      return ApiError(error.message || 'Unknown error occurred', 500);
    }
  }

  /**
   * Process successful response and convert to ApiResponse format
   */
  private handleSuccess<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return ApiSuccess(response.data, response.status);
  }

  /**
   * Make a GET request
   */
  async get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        headers: config?.headers,
        timeout: config?.timeout,
        params: config?.params
      };

      const response = await this.client.get<T>(url, axiosConfig);
      return this.handleSuccess(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  /**
   * Make a POST request
   */
  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        headers: config?.headers,
        timeout: config?.timeout,
        params: config?.params
      };

      const response = await this.client.post<T>(url, data, axiosConfig);
      return this.handleSuccess(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  /**
   * Make a PUT request
   */
  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        headers: config?.headers,
        timeout: config?.timeout,
        params: config?.params
      };

      const response = await this.client.put<T>(url, data, axiosConfig);
      return this.handleSuccess(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  /**
   * Make a PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        headers: config?.headers,
        timeout: config?.timeout,
        params: config?.params
      };

      const response = await this.client.patch<T>(url, data, axiosConfig);
      return this.handleSuccess(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  /**
   * Make a DELETE request
   */
  async delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        headers: config?.headers,
        timeout: config?.timeout,
        params: config?.params
      };

      const response = await this.client.delete<T>(url, axiosConfig);
      return this.handleSuccess(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  /**
   * Update the base configuration
   */
  updateConfig(config: Partial<ApiServiceConfig>): void {
    if (config.baseURL) {
      this.client.defaults.baseURL = config.baseURL;
    }
    if (config.timeout) {
      this.client.defaults.timeout = config.timeout;
    }
    if (config.headers) {
      this.client.defaults.headers = {
        ...this.client.defaults.headers,
        ...config.headers
      };
    }
  }

  /**
   * Set authorization header
   */
  setAuthToken(token: string): void {
    this.client.defaults.headers.Authorization = `Bearer ${token}`;
  }

  /**
   * Remove authorization header
   */
  clearAuthToken(): void {
    delete this.client.defaults.headers.Authorization;
  }
}

// Create a default instance for AI_SERVER
export const AIServerApiService = new ApiService({
  baseURL: process.env.AI_SERVER_URL || 'http://localhost:8000/api',
  timeout: 60000, // 60 seconds for AI operations
  headers: {
    'Accept': 'application/json'
  }
});

// Export the class for creating custom instances
export default ApiService;
