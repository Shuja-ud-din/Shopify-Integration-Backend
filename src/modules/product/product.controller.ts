import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';

import { GetProductDto, UpdateProductDto } from './dtos/getProduct.dto';
import { GetProductInterceptor } from './interceptors/getProduct.interceptor';
import { GetProductsInterceptor } from './interceptors/getProducts.interceptor';
import { GetTagsInterceptor } from './interceptors/getTags.interceptor';
import { SyncProductsInterceptor } from './interceptors/syncProducts.interceptor';
import { UpdateProductInterceptor } from './interceptors/updateProduct.interceptor';
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

  @UseInterceptors(GetProductInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get('/details/:id')
  async getProductById(@Param() params: GetProductDto) {
    return this.productService.getProductById(params.id);
  }

  @UseInterceptors(UpdateProductInterceptor)
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  async updateProduct(
    @Param() params: GetProductDto,
    @Body() body: UpdateProductDto,
  ) {
    return this.productService.updateProduct(params.id, body);
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
