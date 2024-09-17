import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectationCourseComponent } from './affectation-course.component';

describe('AffectationCourseComponent', () => {
  let component: AffectationCourseComponent;
  let fixture: ComponentFixture<AffectationCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffectationCourseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectationCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
