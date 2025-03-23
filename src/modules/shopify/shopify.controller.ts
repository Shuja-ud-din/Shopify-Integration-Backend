import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { IntegrateStoreDto } from './dtos/integrate-store.dto';
import { ShopifyService } from './shopify.service';

@Controller('shopify')
export class ShopifyController {
  constructor(private readonly shopifyService: ShopifyService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/integrate-store')
  async integrateStore(@Body() body: IntegrateStoreDto) {
    return this.shopifyService.integrateStore(body);
  }
}
