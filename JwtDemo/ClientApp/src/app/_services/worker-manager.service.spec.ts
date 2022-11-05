import { TestBed } from '@angular/core/testing';

import { WorkerManagerService } from './worker-manager.service';

describe('WorkerManagerService', () => {
  let service: WorkerManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkerManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
