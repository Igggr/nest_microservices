import { Test, TestingModule } from '@nestjs/testing';
import { TextBlockController } from './text-block.controller';

describe('TextBlockController', () => {
  let controller: TextBlockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextBlockController],
    }).compile();

    controller = module.get<TextBlockController>(TextBlockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
