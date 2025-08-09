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
  private static formatLog(log: RequestLog | ResponseLog): string {
    const baseInfo = `[${log.timestamp}] ${log.type} ${log.method}`;
    const urlInfo = log.url ? ` ${log.url}` : '';
    const userInfo = log.userId ? ` | User: ${log.userId}` : '';
    
    if (log.type === 'REQUEST') {
      const requestLog = log as RequestLog;
      const params = requestLog.params ? ` | Params: ${JSON.stringify(requestLog.params)}` : '';
      const body = requestLog.body ? ` | Body: ${JSON.stringify(requestLog.body)}` : '';
      const query = requestLog.query ? ` | Query: ${JSON.stringify(requestLog.query)}` : '';
      return `${baseInfo}${urlInfo}${userInfo}${params}${body}${query}`;
    } else {
      const responseLog = log as ResponseLog;
      const status = ` | Status: ${responseLog.status}`;
      const duration = responseLog.duration ? ` | Duration: ${responseLog.duration}ms` : '';
      const error = responseLog.error ? ` | Error: ${responseLog.error}` : '';
      const dataInfo = responseLog.data && !responseLog.error ? ` | Data: ${JSON.stringify(responseLog.data)}` : '';
      return `${baseInfo}${urlInfo}${userInfo}${status}${duration}${error}${dataInfo}`;
    }
  }

  static logRequest(method: string, url?: string, userId?: string, params?: any, body?: any, query?: any): void {
    const log: RequestLog = {
      type: 'REQUEST',
      method,
      url,
      userId,
      timestamp: new Date().toISOString(),
      params,
      body,
      query
    };
    console.log(this.formatLog(log));
  }

  static logResponse(method: string, status: number, url?: string, userId?: string, data?: any, error?: string, duration?: number): void {
    const log: ResponseLog = {
      type: 'RESPONSE',
      method,
      url,
      userId,
      timestamp: new Date().toISOString(),
      status,
      data,
      error,
      duration
    };
    console.log(this.formatLog(log));
  }
} 