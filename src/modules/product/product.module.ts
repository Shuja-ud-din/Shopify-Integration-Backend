import { Get, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {
  constructor(private readonly productService: ProductService) {}

  @Get('test')
  async test() {
    return this.productService.test();
  }
}
