interface LogContext {
  method: string;
  url?: string;
  userId?: string;
  timestamp: string;
}

interface RequestLog extends LogContext {
  type: 'REQUEST';
  params?: any;
  body?: any;
  query?: any;
}

interface ResponseLog extends LogContext {
  type: 'RESPONSE';
  status: number;
  data?: any;
  error?: string;
  duration?: number;
}

export class Logger {
  static logRequest(
    method: string,
    url?: string,
    userId?: string,
    params?: any,
    body?: any,
    query?: any,
  ): void {
    const log: RequestLog = {
      type: 'REQUEST',
      method,
      url,
      userId,
      timestamp: new Date().toISOString(),
      params,
      body,
      query,
    };
    console.dir(log, { depth: null, colors: true });
  }

  static logResponse(
    method: string,
    status: number,
    url?: string,
    userId?: string,
    data?: any,
    error?: string,
    duration?: number,
  ): void {
    const log: ResponseLog = {
      type: 'RESPONSE',
      method,
      url,
      userId,
      timestamp: new Date().toISOString(),
      status,
      data,
      error,
      duration,
    };
    console.dir(log, { depth: null, colors: true });
  }
}
