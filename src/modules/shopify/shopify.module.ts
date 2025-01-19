import { Module } from '@nestjs/common';
import { ShopifyService } from './shopify.service';

@Module({
  providers: [ShopifyService],
})
export class ShopifyModule {}
