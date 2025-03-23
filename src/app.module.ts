import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './common/config/app.config';
import dbConfig from './common/config/db.config';
import jwtConfig from './common/config/jwt.config';
import redisConfig from './common/config/redis.config';
import scraperConfig from './common/config/scraper.config';
import shopifyConfig from './common/config/shopify.config';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { ProductGroupModule } from './modules/product-group/product-group.module';
import { RedisModule } from './modules/redis/redis.module';
import { SeedModule } from './modules/seed/seed.module';
import { ShopifyModule } from './modules/shopify/shopify.module';
import { EnvValidationSchema } from './validations/env.validation';

@Module({
  imports: [
    // Config Module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env'
          : `.env.${process.env.NODE_ENV || 'development'}`,
      load: [
        appConfig,
        dbConfig,
        jwtConfig,
        redisConfig,
        shopifyConfig,
        scraperConfig,
      ],
      validationSchema: EnvValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    // MongoDB Module
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('MongoDB');
        const connectionString = configService.get('database.mongoUrl');

        try {
          await mongoose.connect(connectionString);
          logger.log('MongoDB connected successfully');
        } catch (error) {
          logger.error('Error connecting to MongoDB', error.stack);
        }

        return {
          uri: connectionString,
        };
      },
    }),

    RedisModule,
    ProductModule,
    AuthModule,
    SeedModule,
    ProductGroupModule,
    ShopifyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
