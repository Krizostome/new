import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesCoursesComponent } from './demandes-courses.component';

describe('DemandesCoursesComponent', () => {
  let component: DemandesCoursesComponent;
  let fixture: ComponentFixture<DemandesCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandesCoursesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandesCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
