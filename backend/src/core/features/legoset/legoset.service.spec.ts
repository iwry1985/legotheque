import { Test, TestingModule } from '@nestjs/testing';
import { LegosetService } from './legoset.service';

describe('LegosetService', () => {
  let service: LegosetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LegosetService],
    }).compile();

    service = module.get<LegosetService>(LegosetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
