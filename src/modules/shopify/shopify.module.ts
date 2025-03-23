import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/common/middlewares/auth.middleware';

import { User, UserSchema } from '../user/entities/user.entity';
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
    MongooseModule.forFeature([
      { name: ShopifyStore.name, schema: ShopifyStoreSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [ShopifyService],
})
export class ShopifyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('shopify');
  }
}
