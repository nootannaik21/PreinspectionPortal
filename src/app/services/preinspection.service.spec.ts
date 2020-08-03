import { TestBed } from '@angular/core/testing';

import { PreinspectionService } from './preinspection.service';

describe('PreinspectionService', () => {
  let service: PreinspectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreinspectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
