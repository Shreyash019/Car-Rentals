export interface LoggerOptions {
  service: string;
  environment?: string;
  version?: string;
  logDir?: string; 
  logFileName?: string;
  logLevel?: 'info' | 'debug' | 'error' | 'warn';
  enableConsole?: boolean;
  enableFile?: boolean;
}
