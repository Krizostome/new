import { TestBed } from '@angular/core/testing';

import { PlanningGardeService } from './planning-garde.service';

describe('PlanningGardeService', () => {
  let service: PlanningGardeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanningGardeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
