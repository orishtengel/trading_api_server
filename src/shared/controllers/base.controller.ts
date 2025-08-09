import { Router, Request, Response, NextFunction } from 'express';
import { createLoggingMiddleware } from '@shared/middleware/logging.middleware';

interface ControllerConfig {
  enableLogging?: boolean;
  loggingOptions?: {
    redactFields?: string[];
    logResponseData?: boolean;
    extractUserId?: (req: Request) => string | undefined;
  };
  customMiddleware?: Array<(req: Request, res: Response, next: NextFunction) => void>;
}

export abstract class BaseController {
  protected router: Router;
  protected config: ControllerConfig;

  constructor(config: ControllerConfig = {}) {
    this.router = Router();
    this.config = {
      enableLogging: true,
      loggingOptions: {},
      customMiddleware: [],
      ...config
    };
    
    this.setupMiddleware();
  }

  private setupMiddleware(): void {
    // Apply custom middleware first
    if (this.config.customMiddleware) {
      this.config.customMiddleware.forEach(middleware => {
        this.router.use(middleware);
      });
    }

    // Apply logging middleware if enabled
    if (this.config.enableLogging) {
      this.router.use(createLoggingMiddleware(this.config.loggingOptions));
    }
  }

  protected addRoute(
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    path: string,
    handler: (req: Request, res: Response) => Promise<void> | void,
    routeSpecificMiddleware?: Array<(req: Request, res: Response, next: NextFunction) => void>
  ): void {
    const middlewares = routeSpecificMiddleware || [];
    
    // Add logging middleware with method name for this specific route
    if (this.config.enableLogging) {
      const methodName = handler.name || `${method}_${path.replace('/', '_')}`;
      const loggingMiddleware = createLoggingMiddleware({
        ...this.config.loggingOptions,
        methodName
      });
      middlewares.unshift(loggingMiddleware);
    }
    
    this.router[method](path, ...middlewares, handler.bind(this));
  }

  public getRouter(): Router {
    return this.router;
  }
} 