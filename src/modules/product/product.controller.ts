import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { GetProductsInterceptor } from './interceptors/getProducts.interceptor';
import { GetTagsInterceptor } from './interceptors/getTags.interceptor';
import { SyncProductsInterceptor } from './interceptors/syncProducts.interceptor';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseInterceptors(GetProductsInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get('')
  async getProducts() {
    return this.productService.getProducts();
  }

  @UseInterceptors(GetTagsInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get('/tags')
  async getTags() {
    return this.productService.getTags();
  }

  @UseInterceptors(SyncProductsInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('/sync')
  async syncProducts() {
    return this.productService.syncProducts();
  }
}
