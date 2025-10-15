import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegoList } from './lego-list';

describe('LegoList', () => {
  let component: LegoList;
  let fixture: ComponentFixture<LegoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegoList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegoList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
