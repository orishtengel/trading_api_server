import { Response } from 'express';

export function getCorsOrigin(): string {
  return (
    process.env.CORS_ORIGIN ||
    (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',')[0] : undefined) ||
    'http://localhost:5173'
  );
}

export const commonCorsHeaders: Record<string, string> = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Cache-Control', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Cache-Control'],
    preflightContinue: false,
    optionsSuccessStatus: 200
  };
}


