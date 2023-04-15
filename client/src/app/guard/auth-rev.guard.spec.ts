import { TestBed } from '@angular/core/testing';

import { AuthRevGuard } from './auth-rev.guard';

describe('AuthRevGuard', () => {
  let guard: AuthRevGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthRevGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
