import { Module } from '@nestjs/common';
import { ImageProcessingModuleController } from './image-processing-module.controller';
import { ImageProcessingModuleService } from './image-processing-module.service';
import { AwsS3Service } from '../aws/aws-s3.service';
@Module({
  controllers: [ImageProcessingModuleController],
  providers: [ImageProcessingModuleService, AwsS3Service]
})
export class ImageProcessingModuleModule {}
