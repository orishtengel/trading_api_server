import { Response } from 'express';
import * as functions from 'firebase-functions';

/**
 * Get configuration value from Firebase Functions config or environment variables
 */
function getConfig(path: string, fallback?: string): string | undefined {
  try {
    // In Firebase Functions environment, use functions.config()
    if (process.env.FUNCTIONS_EMULATOR || process.env.NODE_ENV === 'production') {
      const config = functions.config();
      const keys = path.split('.');
      let value: any = config;
      for (const key of keys) {
        value = value?.[key];
      }
      return typeof value === 'string' ? value : fallback;
    }
    // In local development, use process.env
    return process.env[path.toUpperCase().replace('.', '_')] || fallback;
  } catch (error) {
    console.warn(`Failed to get config for ${path}:`, error);
    return fallback;
  }
}

export function getCorsOrigin(): string {
  return (
    getConfig('cors.origin') ||
    (getConfig('cors.allowed_origins')?.split(',')[0]) ||
    (process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : 'https://trading-platform-d1b16.web.app')
  );
}

export const commonCorsHeaders: Record<string, string> = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Cache-Control, Authorization',
  'Access-Control-Expose-Headers': 'Content-Type, Cache-Control'
};

export function applySseHeaders(res: Response): void {
  const corsOrigin = getCorsOrigin();
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  for (const [key, value] of Object.entries(commonCorsHeaders)) {
    res.setHeader(key, value);
  }
  
  // Ensure headers are sent immediately
  if (typeof (res as any).flushHeaders === 'function') {
    (res as any).flushHeaders();
  }
}

export function buildCorsOptions() {
  return {
    origin: getCorsOrigin(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Cache-Control', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Cache-Control'],
    preflightContinue: false,
    optionsSuccessStatus: 200
  };
}


