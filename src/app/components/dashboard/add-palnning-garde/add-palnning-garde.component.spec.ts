import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPalnningGardeComponent } from './add-palnning-garde.component';

describe('AddPalnningGardeComponent', () => {
  let component: AddPalnningGardeComponent;
  let fixture: ComponentFixture<AddPalnningGardeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPalnningGardeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPalnningGardeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
