import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/common/middlewares/auth.middleware';

import { RedisModule } from '../redis/redis.module';
import { ScraperModule } from '../scraper/scraper.module';
import { ShopifyModule } from '../shopify/shopify.module';
import { ShopifyService } from '../shopify/shopify.service';
import { ProductSchema } from './entities/product.entity';
import { Product } from './entities/product.entity';
import { TagSchema } from './entities/tag.entity';
import { Tag } from './entities/tag.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  providers: [ProductService, ShopifyService],
  controllers: [ProductController],
  imports: [
    ShopifyModule,
    RedisModule,
    ScraperModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
  ],
  exports: [ProductService, MongooseModule],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('products');
  }
}
