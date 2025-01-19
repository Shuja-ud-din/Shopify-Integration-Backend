import { Controller, Get, Inject } from '@nestjs/common';
import { ProductService } from './product.service';
import Redis from 'ioredis';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  @Get('test')
  async test() {
    return this.productService.test();
  }

  @Get('shopify/products')
  async getShopifyProducts() {
    return this.productService.getShopifyProducts();
  }
}
