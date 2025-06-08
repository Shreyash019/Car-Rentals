import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 4002;
  const isProd = process.env.NODE_ENV === 'production';
  const host = isProd ? '0.0.0.0' : 'localhost';
  await app.listen(port, host);
}
bootstrap();
