import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueChauffeursComponent } from './historique-chauffeurs.component';

describe('HistoriqueChauffeursComponent', () => {
  let component: HistoriqueChauffeursComponent;
  let fixture: ComponentFixture<HistoriqueChauffeursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriqueChauffeursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueChauffeursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
