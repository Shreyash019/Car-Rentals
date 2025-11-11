import * as path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '../.env') });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initSentry, SentryExceptionFilter } from '@repo/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initSentry({
    dsn: process.env.SENTRY_DSN!,
    environment: process.env.NODE_ENV!,
    serviceName: process.env.SERVICE_NAME!,
  });
  console.log('Server starting...', process.env.PORT!);
  app.useGlobalFilters(new SentryExceptionFilter());
  await app.listen(process.env.PORT!);
}
bootstrap();
