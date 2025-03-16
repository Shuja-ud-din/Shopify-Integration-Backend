import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';

import { GetProductDto, UpdateProductDto } from './dtos/getProduct.dto';
import { BlockProductUpdateInterceptor } from './interceptors/blockProductUpdate.interceptor';
import { GetProductInterceptor } from './interceptors/getProduct.interceptor';
import { GetProductsInterceptor } from './interceptors/getProducts.interceptor';
import { GetTagsInterceptor } from './interceptors/getTags.interceptor';
import { ScrapeProductInterceptor } from './interceptors/scrapeProduct.interceptor';
import { SyncProductsInterceptor } from './interceptors/syncProducts.interceptor';
import { UnblockProductUpdateInterceptor } from './interceptors/unblockProductUpdate.interceptor';
import { UpdateProductInterceptor } from './interceptors/updateProduct.interceptor';
import { UpdateShopifyProductInterceptor } from './interceptors/updateShopifyProduct.interceptor';
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

  @UseInterceptors(ScrapeProductInterceptor)
  @HttpCode(HttpStatus.OK)
  @Patch('/scrape/:id')
  async scrapeProduct(@Param() params: GetProductDto) {
    return this.productService.scrapeProduct(params.id);
  }

  @UseInterceptors(BlockProductUpdateInterceptor)
  @HttpCode(HttpStatus.OK)
  @Patch('/blockUpdate/:id')
  async blockProductUpdate(@Param() params: GetProductDto) {
    return this.productService.blockProductUpdate(params.id);
  }

  @UseInterceptors(UnblockProductUpdateInterceptor)
  @HttpCode(HttpStatus.OK)
  @Patch('/unblockUpdate/:id')
  async unblockProductUpdate(@Param() params: GetProductDto) {
    return this.productService.unblockProductUpdate(params.id);
  }

  @UseInterceptors(UpdateShopifyProductInterceptor)
  @HttpCode(HttpStatus.OK)
  @Put('/shopify/:id')
  async updateProductToShopify(@Param() params: GetProductDto) {
    return this.productService.updateDBProductToShopify(params.id);
  }

  @UseInterceptors(SyncProductsInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('/sync')
  async syncProducts() {
    return this.productService.syncProducts();
  }
}
