export { swaggerSpec } from './swagger.config';

// Import path definitions to ensure they're included in the build
import './paths/auth';
import './paths/bots';
import './paths/users';
import './paths/backtest';
