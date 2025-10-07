import { Test, TestingModule } from '@nestjs/testing';
import { LegosetController } from './legoset.controller';

describe('LegosetController', () => {
  let controller: LegosetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LegosetController],
    }).compile();

    controller = module.get<LegosetController>(LegosetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
