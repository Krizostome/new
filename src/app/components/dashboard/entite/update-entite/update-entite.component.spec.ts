import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEntiteComponent } from './update-entite.component';

describe('UpdateEntiteComponent', () => {
  let component: UpdateEntiteComponent;
  let fixture: ComponentFixture<UpdateEntiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateEntiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateEntiteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
