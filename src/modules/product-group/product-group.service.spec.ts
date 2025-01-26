import { Test, TestingModule } from '@nestjs/testing';

import { ProductGroupService } from './product-group.service';

describe('ProductGroupService', () => {
  let service: ProductGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductGroupService],
    }).compile();

    service = module.get<ProductGroupService>(ProductGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
