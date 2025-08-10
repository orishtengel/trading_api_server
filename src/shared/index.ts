/**
 * Shared modules for trading_api_server
 * 
 * This barrel file exports commonly used shared functionality
 * including HTTP utilities, middleware, logging, and gRPC client.
 */

// HTTP utilities
export * from './http/api';
export * from './http/cors';

// Middleware
export * from './middleware';

// Logging
export * from './logger';

// Controllers
export * from './controllers';

// Firebase utilities
export * from './firebase/firebase.admin.config';
export * from './firebase/firestore.utils';

// gRPC client
export * from './grpc';
