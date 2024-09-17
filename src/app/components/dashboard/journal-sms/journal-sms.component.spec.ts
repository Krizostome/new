import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalSmsComponent } from './journal-sms.component';

describe('JournalSmsComponent', () => {
  let component: JournalSmsComponent;
  let fixture: ComponentFixture<JournalSmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JournalSmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
