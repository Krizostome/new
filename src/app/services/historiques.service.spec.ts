import { TestBed } from '@angular/core/testing';

import { HistoriquesService } from './historiques.service';

describe('HistoriquesService', () => {
  let service: HistoriquesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoriquesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
