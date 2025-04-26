import { Test, TestingModule } from '@nestjs/testing';

import { FormulaService } from './formula.service';

describe('FormulaService', () => {
  let service: FormulaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormulaService],
    }).compile();

    service = module.get<FormulaService>(FormulaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
