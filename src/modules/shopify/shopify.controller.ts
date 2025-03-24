import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { StoreGuard } from 'src/common/guards/store.guard';
import { ITokenPayload } from 'src/common/utils/token';

import { IntegrateStoreDto } from './dtos/integrate-store.dto';
import { GetStoreInterceptor } from './interceptors/getStore.interceptor';
import { GetStoresInterceptor } from './interceptors/getStores.interceptor';
import { IntegrateStoreInterceptor } from './interceptors/integrateStore.interceptor';
import { ShopifyService } from './shopify.service';

@Controller('shopify')
export class ShopifyController {
  constructor(private readonly shopifyService: ShopifyService) {}

  @UseInterceptors(IntegrateStoreInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('/integrate-store')
  async integrateStore(
    @Body() body: IntegrateStoreDto,
    @User() user: ITokenPayload,
  ) {
    return this.shopifyService.integrateStore(body, user.id);
  }

  @UseInterceptors(GetStoresInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get('/stores')
  async getStores(@User() user: ITokenPayload) {
    return this.shopifyService.getStores(user.id);
  }

  @UseInterceptors(GetStoreInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get('/store/details')
  @UseGuards(StoreGuard)
  async getStore(@Query('store') store: string) {
    return this.shopifyService.getStoreById(store);
  }
}
