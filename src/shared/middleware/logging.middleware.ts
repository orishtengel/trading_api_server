import { Request, Response, NextFunction } from 'express';
import { Logger } from '@shared/logger';

interface LoggingOptions {
  redactFields?: string[];
  logResponseData?: boolean;
  extractUserId?: (req: Request) => string | undefined;
  methodName?: string;
}

export function createLoggingMiddleware(options: LoggingOptions = {}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const methodName = options.methodName || req.route?.path || 'unknown';
    
    // Extract user ID if function provided
    const userId = options.extractUserId ? options.extractUserId(req) : 
                   req.params.uid || req.params.id || undefined;
    
    // Prepare request body for logging (redact sensitive fields)
    let logBody = req.body;
    if (options.redactFields && logBody) {
      logBody = { ...req.body };
      options.redactFields.forEach(field => {
        if (logBody[field]) {
          logBody[field] = '[REDACTED]';
        }
      });
    }
    
    // Log incoming request
    Logger.logRequest(
      methodName,
      req.originalUrl,
      userId,
      req.params,
      logBody,
      req.query
    );

    // Store original response methods
    const originalJson = res.json.bind(res);
    const originalStatus = res.status.bind(res);
    let responseData: any;
    let statusCode = 200;

    // Override res.status to capture status code
    res.status = function(code: number) {
      statusCode = code;
      return originalStatus(code);
    };

    // Override res.json to capture response data
    res.json = function(data: any) {
      responseData = data;
      
      const duration = Date.now() - startTime;
      
      // Prepare response data for logging
      let logResponseData = responseData;
      if (!options.logResponseData && responseData) {
        // Log minimal info for responses
        if (responseData.data && responseData.data.user) {
          logResponseData = {
            data: {
              user: {
                uid: responseData.data.user.uid,
                email: responseData.data.user.email
              }
            }
          };
        } else if (responseData.data && responseData.data.id) {
          logResponseData = {
            data: { id: responseData.data.id }
          };
        } else if (responseData.error) {
          logResponseData = { error: responseData.error };
        }
      }
      
      // Log response
      Logger.logResponse(
        methodName,
        statusCode,
        req.originalUrl,
        userId,
        logResponseData,
        responseData?.error,
        duration
      );
      
      return originalJson(data);
    };

    next();
  };
} 