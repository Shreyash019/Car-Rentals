import { Test, TestingModule } from '@nestjs/testing';
import { ImageProcessingModuleService } from './image-processing-module.service';

describe('ImageProcessingModuleService', () => {
  let service: ImageProcessingModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageProcessingModuleService],
    }).compile();

    service = module.get<ImageProcessingModuleService>(ImageProcessingModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
