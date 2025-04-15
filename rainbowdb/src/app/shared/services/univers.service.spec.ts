import { TestBed } from '@angular/core/testing';

import { UniversService } from './univers.service';

describe('UniversService', () => {
  let service: UniversService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniversService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
