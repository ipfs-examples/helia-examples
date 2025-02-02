import { TestBed } from '@angular/core/testing';

import { HeliaService } from './helia.service';

describe('HeliaService', () => {
  let service: HeliaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeliaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
