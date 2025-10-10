import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { legosetResolver } from './legoset-resolver';

describe('legosetResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => legosetResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
