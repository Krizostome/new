import { TestBed } from '@angular/core/testing';

import { AdministrationGuard } from './administration.guard';

describe('AdministrationGuard', () => {
  let guard: AdministrationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdministrationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
