export const loggerInit = () => {
  console.log('Logger initialized');
};
export { initSentry, SentryOptions } from "./sentry.config";
export { SentryExceptionFilter } from "./exception.filter";