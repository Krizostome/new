import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalnningGardeComponent } from './palnning-garde.component';

describe('PalnningGardeComponent', () => {
  let component: PalnningGardeComponent;
  let fixture: ComponentFixture<PalnningGardeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PalnningGardeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PalnningGardeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
