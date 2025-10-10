import { TestBed } from '@angular/core/testing';

import { LegosetService } from './legoset-service';

describe('Legoset', () => {
  let service: LegosetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LegosetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
