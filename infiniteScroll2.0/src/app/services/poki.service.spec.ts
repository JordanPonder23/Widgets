import { TestBed } from '@angular/core/testing';

import { PokiService } from './poki.service';

describe('PokiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PokiService = TestBed.get(PokiService);
    expect(service).toBeTruthy();
  });
});
