import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';

async function bootstrap() {
  loadEnv({ path: resolve(__dirname, '..', '.env') });
  const app = await NestFactory.create(AppModule);
  const servicePort: number = Number(process.env.CONTENT_SERVICE_PORT)
  if(!servicePort){
    process.exit(1);
  }
  app.setGlobalPrefix('api/content-service')
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })
  
  await app.listen(servicePort);
}
bootstrap();
