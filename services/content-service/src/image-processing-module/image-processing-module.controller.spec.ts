import { Test, TestingModule } from '@nestjs/testing';
import { ImageProcessingModuleController } from './image-processing-module.controller';

describe('ImageProcessingModuleController', () => {
  let controller: ImageProcessingModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageProcessingModuleController],
    }).compile();

    controller = module.get<ImageProcessingModuleController>(ImageProcessingModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
