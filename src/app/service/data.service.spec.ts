import { TestBed } from '@angular/core/testing';
import { userService } from './user.service';

describe('dataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: userService = TestBed.get(userService);
    expect(service).toBeTruthy();
  });
});
