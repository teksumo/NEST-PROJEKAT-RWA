import { Test, TestingModule } from '@nestjs/testing';
import { ReceptService } from './recept.service';

describe('ReceptService', () => {
  let service: ReceptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceptService],
    }).compile();

    service = module.get<ReceptService>(ReceptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
