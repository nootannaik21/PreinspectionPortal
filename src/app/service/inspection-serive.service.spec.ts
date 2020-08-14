import { TestBed } from '@angular/core/testing';

import { InspectionSeriveService } from './inspection-serive.service';

describe('InspectionSeriveService', () => {
  let service: InspectionSeriveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InspectionSeriveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
