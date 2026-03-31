import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashUnComponent } from './dash-un.component';

describe('DashUnComponent', () => {
  let component: DashUnComponent;
  let fixture: ComponentFixture<DashUnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashUnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashUnComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
