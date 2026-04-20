import { TestBed } from '@angular/core/testing';

import { Loader } from './loader';

describe('Loader', () => {
  let service: Loader;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Loader);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
