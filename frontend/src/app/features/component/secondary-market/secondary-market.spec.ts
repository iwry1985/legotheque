import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryMarket } from './secondary-market';

describe('SecondaryMarket', () => {
  let component: SecondaryMarket;
  let fixture: ComponentFixture<SecondaryMarket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondaryMarket]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondaryMarket);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
