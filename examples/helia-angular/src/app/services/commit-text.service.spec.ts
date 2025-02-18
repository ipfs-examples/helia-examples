import { TestBed } from '@angular/core/testing';

import { CommitTextService } from './commit-text.service';

describe('CommitTextService', () => {
  let service: CommitTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommitTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
