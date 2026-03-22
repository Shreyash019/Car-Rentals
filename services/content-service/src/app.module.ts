import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImageProcessingModuleModule } from './image-processing-module/image-processing-module.module';

@Module({
  imports: [ImageProcessingModuleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
