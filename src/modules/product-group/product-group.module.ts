import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/common/middlewares/auth.middleware';

import { ProductModule } from '../product/product.module';
import { ShopifyModule } from '../shopify/shopify.module';
import {
  ProductGroup,
  ProductGroupSchema,
} from './entities/product-group.entity';
import { ProductGroupController } from './product-group.controller';
import { ProductGroupService } from './product-group.service';
import { ScraperModule } from './scraper/scraper.module';

@Module({
  providers: [ProductGroupService],
  controllers: [ProductGroupController],
  imports: [
    MongooseModule.forFeature([
      { name: ProductGroup.name, schema: ProductGroupSchema },
    ]),
    ProductModule,
    ScraperModule,
    ShopifyModule,
  ],
  exports: [ProductGroupService],
})
export class ProductGroupModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('product-groups');
  }
}
