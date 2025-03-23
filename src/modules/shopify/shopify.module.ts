import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/common/middlewares/auth.middleware';

import {
  ShopifyStore,
  ShopifyStoreSchema,
} from './entities/shopifyStore.entity';
import { ShopifyController } from './shopify.controller';
import { ShopifyService } from './shopify.service';

@Module({
  providers: [ShopifyService],
  controllers: [ShopifyController],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: ShopifyStore.name, schema: ShopifyStoreSchema },
    ]),
  ],
  exports: [ShopifyService],
})
export class ShopifyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('shopify');
  }
}
