import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegoSummary } from './lego-summary';

describe('LegoSummary', () => {
  let component: LegoSummary;
  let fixture: ComponentFixture<LegoSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegoSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegoSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
