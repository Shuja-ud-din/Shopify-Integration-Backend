import { Module } from '@nestjs/common';

import { ProductGroupController } from './product-group.controller';
import { ProductGroupService } from './product-group.service';

@Module({
  providers: [ProductGroupService],
  controllers: [ProductGroupController],
  exports: [ProductGroupService],
})
export class ProductGroupModule {}
