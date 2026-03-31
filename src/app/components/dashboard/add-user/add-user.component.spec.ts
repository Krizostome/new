import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgSelectModule } from '@ng-select/ng-select';

import { AddUserComponent } from './add-user.component';

describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUserComponent, NgSelectModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
