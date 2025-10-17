import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegoCollection } from './lego-collection';

describe('LegoCollection', () => {
  let component: LegoCollection;
  let fixture: ComponentFixture<LegoCollection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegoCollection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegoCollection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
