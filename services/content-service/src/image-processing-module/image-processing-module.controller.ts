import { Controller, Get, Version } from '@nestjs/common';

@Controller('image-processing')
export class ImageProcessingModuleController {
    constructor(){}

    @Get('/health')
    getImageProcessingModuleHealth(){
        return 'Image Module is healthy'
    }

    @Get('/health')
    @Version('2')
    getImageProcessingModuleHealthV2(){
        return 'Image Processing Module is UP'
    }
}
