import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteCourseComponent } from './note-course.component';

describe('NoteCourseComponent', () => {
  let component: NoteCourseComponent;
  let fixture: ComponentFixture<NoteCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteCourseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
