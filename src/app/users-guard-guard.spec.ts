import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { usersGuardGuard } from './users-guard-guard';

describe('usersGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => usersGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
