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
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StoreGuard } from 'src/common/guards/store.guard';

import { GetProductDto, UpdateProductDto } from './dtos/getProduct.dto';
import { BlockProductUpdateInterceptor } from './interceptors/blockProductUpdate.interceptor';
import { GetProductInterceptor } from './interceptors/getProduct.interceptor';
import { GetProductsInterceptor } from './interceptors/getProducts.interceptor';
import { GetTagsInterceptor } from './interceptors/getTags.interceptor';
import { ScrapeProductInterceptor } from './interceptors/scrapeProduct.interceptor';
import { SyncProductInterceptor } from './interceptors/syncProduct.interceptor';
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
  @UseGuards(StoreGuard)
  async getProducts(@Query('store') storeId: string) {
    return this.productService.getProducts(storeId);
  }

  @UseInterceptors(GetProductInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get('/details/:id')
  @UseGuards(StoreGuard)
  async getProductById(
    @Param() params: GetProductDto,
    @Query('store') storeId: string,
  ) {
    return this.productService.getProductById(storeId, params.id);
  }

  @UseInterceptors(UpdateProductInterceptor)
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  @UseGuards(StoreGuard)
  async updateProduct(
    @Param() params: GetProductDto,
    @Body() body: UpdateProductDto,
    @Query('store') storeId: string,
  ) {
    return this.productService.updateProduct(params.id, storeId, body);
  }

  @UseInterceptors(GetTagsInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get('/tags')
  @UseGuards(StoreGuard)
  async getTags(@Query('store') storeId: string) {
    return this.productService.getTags(storeId);
  }

  @UseInterceptors(ScrapeProductInterceptor)
  @HttpCode(HttpStatus.OK)
  @Patch('/scrape/:id')
  @UseGuards(StoreGuard)
  async scrapeProduct(
    @Param() params: GetProductDto,
    @Query('store') storeId: string,
  ) {
    return this.productService.scrapeProduct(storeId, params.id);
  }

  @UseInterceptors(BlockProductUpdateInterceptor)
  @HttpCode(HttpStatus.OK)
  @Patch('/blockUpdate/:id')
  @UseGuards(StoreGuard)
  async blockProductUpdate(
    @Param() params: GetProductDto,
    @Query('store') storeId: string,
  ) {
    return this.productService.blockProductUpdate(storeId, params.id);
  }

  @UseInterceptors(UnblockProductUpdateInterceptor)
  @HttpCode(HttpStatus.OK)
  @Patch('/unblockUpdate/:id')
  @UseGuards(StoreGuard)
  async unblockProductUpdate(
    @Param() params: GetProductDto,
    @Query('store') storeId: string,
  ) {
    return this.productService.unblockProductUpdate(storeId, params.id);
  }

  @UseInterceptors(UpdateShopifyProductInterceptor)
  @HttpCode(HttpStatus.OK)
  @Put('/shopify/:id')
  @UseGuards(StoreGuard)
  async updateProductToShopify(
    @Param() params: GetProductDto,
    @Query('store') storeId: string,
  ) {
    return this.productService.updateProductToShopify(storeId, params.id);
  }

  @UseInterceptors(SyncProductInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('/sync/:id')
  @UseGuards(StoreGuard)
  async syncProduct(
    @Param() params: GetProductDto,
    @Query('store') storeId: string,
  ) {
    return this.productService.syncProduct(storeId, params.id);
  }

  @UseInterceptors(SyncProductsInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('/sync')
  @UseGuards(StoreGuard)
  async syncProducts(@Query('store') storeId: string) {
    return this.productService.syncProducts(storeId);
  }
}
