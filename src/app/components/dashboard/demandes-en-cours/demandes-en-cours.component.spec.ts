import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesEnCoursComponent } from './demandes-en-cours.component';

describe('DemandesEnCoursComponent', () => {
  let component: DemandesEnCoursComponent;
  let fixture: ComponentFixture<DemandesEnCoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandesEnCoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandesEnCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
