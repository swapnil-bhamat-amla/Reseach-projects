import { TestBed } from '@angular/core/testing';

import { MyArtService } from './my-art.service';

describe('MyArtService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyArtService = TestBed.get(MyArtService);
    expect(service).toBeTruthy();
  });
});
