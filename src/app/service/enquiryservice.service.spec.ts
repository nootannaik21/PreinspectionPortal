import { TestBed } from '@angular/core/testing';

import { EnquiryserviceService } from './enquiryservice.service';

describe('EnquiryserviceService', () => {
  let service: EnquiryserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnquiryserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
