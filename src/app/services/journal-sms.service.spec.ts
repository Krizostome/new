import { TestBed } from '@angular/core/testing';

import { JournalSmsService } from './journal-sms.service';

describe('JournalSmsService', () => {
  let service: JournalSmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JournalSmsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
