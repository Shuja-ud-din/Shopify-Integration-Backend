import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthMiddleware } from '@/common/middlewares/auth.middleware';

import { FormulaModule } from '../formula/formula.module';
import { ProductModule } from '../product/product.module';
import { QueueModule } from '../queue/queue.module';
import { ScraperModule } from '../scraper/scraper.module';
import {
  ProductGroup,
  ProductGroupSchema,
} from './entities/product-group.entity';
import { ProductGroupController } from './product-group.controller';
import { ProductGroupService } from './product-group.service';

@Module({
  providers: [ProductGroupService],
  controllers: [ProductGroupController],
  imports: [
    MongooseModule.forFeature([
      { name: ProductGroup.name, schema: ProductGroupSchema },
    ]),
    ProductModule,
    ScraperModule,
    FormulaModule,
    forwardRef(() => QueueModule), // 🔁 fix circular dependency
  ],
  exports: [ProductGroupService],
})
export class ProductGroupModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('product-groups');
  }
}
