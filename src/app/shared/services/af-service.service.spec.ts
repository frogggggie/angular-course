import { TestBed } from '@angular/core/testing';

import { AfServiceService } from './af-service.service';

describe('AfServiceService', () => {
  let service: AfServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AfServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
