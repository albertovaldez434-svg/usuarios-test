import { TestBed } from '@angular/core/testing';
import { Demo } from './demo';

describe('Demo', () => {
  let service: Demo;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Demo]
    });

    service = TestBed.inject(Demo);
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });
});

