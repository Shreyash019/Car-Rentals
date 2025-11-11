import * as Sentry from "@sentry/node";

export interface SentryOptions {
  dsn: string;
  environment: string;
  serviceName: string;
  tracesSampleRate?: number;
  debug?: boolean;
}

export function initSentry(options: SentryOptions): void {
  Sentry.init({
    dsn: options.dsn,
    environment: options.environment,
    tracesSampleRate: options.tracesSampleRate ?? (options.environment === "production" ? 0.2 : 1.0),
    debug: options.debug ?? (options.environment !== "production"),
    initialScope: scope => scope.setTag("service", options.serviceName),
  });
}
