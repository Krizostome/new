import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDemandeCourseComponent } from './add-demande-course.component';

describe('AddDemandeCourseComponent', () => {
  let component: AddDemandeCourseComponent;
  let fixture: ComponentFixture<AddDemandeCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDemandeCourseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDemandeCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
