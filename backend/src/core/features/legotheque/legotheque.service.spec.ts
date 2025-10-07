import { Test, TestingModule } from '@nestjs/testing';
import { LegothequeService } from './legotheque.service';

describe('LegothequeService', () => {
  let service: LegothequeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LegothequeService],
    }).compile();

    service = module.get<LegothequeService>(LegothequeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
