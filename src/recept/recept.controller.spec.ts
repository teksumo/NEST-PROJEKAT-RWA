import { Test, TestingModule } from '@nestjs/testing';
import { ReceptController } from './recept.controller';

describe('ReceptController', () => {
  let controller: ReceptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceptController],
    }).compile();

    controller = module.get<ReceptController>(ReceptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
