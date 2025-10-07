import { Test, TestingModule } from '@nestjs/testing';
import { LegothequeController } from './legotheque.controller';

describe('LegothequeController', () => {
  let controller: LegothequeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LegothequeController],
    }).compile();

    controller = module.get<LegothequeController>(LegothequeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
