import { Body, Controller, Get, Post, Version, Query } from '@nestjs/common';
import { AwsS3Service } from '../aws/aws-s3.service';

@Controller('image-processing')
export class ImageProcessingModuleController {
  constructor(private readonly s3Service: AwsS3Service) {}

  @Get('/health')
  getImageProcessingModuleHealth() {
    return 'Image Module is healthy';
  }

  @Get('/health')
  @Version('2')
  getImageProcessingModuleHealthV2() {
    return 'Image Processing Module is UP';
  }

  @Post('upload')
  async getPresignedUrl(@Body('contentType') contentType: string) {
    const userId: string = 'sk1234556sg';
    console.log('API hit');
    return this.s3Service.getPresignedPostUrl(userId, contentType);
  }
  @Get('view')
  async getImageViewingUrl(@Query('key') s3Key: string) {
    // In production, you would check your JWT here to ensure
    // the user making this request is authorized to view this specific image key.
    console.log('API hit 2');
    const url = await this.s3Service.getContentDownloadUrl(s3Key);
    return { url };
  }
}
