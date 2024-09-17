import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsChauffeurComponent } from './details-chauffeur.component';

describe('DetailsChauffeurComponent', () => {
  let component: DetailsChauffeurComponent;
  let fixture: ComponentFixture<DetailsChauffeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsChauffeurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsChauffeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
