import { Module } from '@nestjs/common';
import { ImageProcessingModuleController } from './image-processing-module.controller';
import { ImageProcessingModuleService } from './image-processing-module.service';

@Module({
  controllers: [ImageProcessingModuleController],
  providers: [ImageProcessingModuleService]
})
export class ImageProcessingModuleModule {}
