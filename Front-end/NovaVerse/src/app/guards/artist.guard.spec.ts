import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { artistGuard } from './artist.guard';

describe('artistGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => artistGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
