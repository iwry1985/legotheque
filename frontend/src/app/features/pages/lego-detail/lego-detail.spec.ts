import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegoDetail } from './lego-detail';

describe('LegoDetail', () => {
  let component: LegoDetail;
  let fixture: ComponentFixture<LegoDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegoDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegoDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
