import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ShopifyService } from '../shopify/shopify.service';
import { ShopifyModule } from '../shopify/shopify.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  providers: [ProductService, ShopifyService],
  controllers: [ProductController],
  imports: [ShopifyModule, RedisModule],
})
export class ProductModule {}
