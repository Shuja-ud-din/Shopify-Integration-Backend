import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { ITokenPayload } from 'src/common/utils/token';

import { IntegrateStoreDto } from './dtos/integrate-store.dto';
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
}
