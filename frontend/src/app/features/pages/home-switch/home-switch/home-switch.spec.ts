import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSwitch } from './home-switch';

describe('HomeSwitch', () => {
  let component: HomeSwitch;
  let fixture: ComponentFixture<HomeSwitch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeSwitch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeSwitch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
