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
import { AuthModule } from './modules/auth/auth.module';
import { FormulaModule } from './modules/formula/formula.module';
import { ProductModule } from './modules/product/product.module';
import { ProductGroupModule } from './modules/product-group/product-group.module';
import { QueueModule } from './modules/queue/queue.module';
import { RedisModule } from './modules/redis/redis.module';
import { SeedModule } from './modules/seed/seed.module';
import { ShopifyModule } from './modules/shopify/shopify.module';
import { EnvValidationSchema } from './validations/env.validation';

const configLogger = new Logger('Config');

const envFilePath =
  process.env.NODE_ENV === 'production'
    ? '.env'
    : `.env.${process.env.NODE_ENV || 'development'}`;

configLogger.log(`📦 Using env file: ${envFilePath}`);

@Module({
  imports: [
    // Config Module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [appConfig, dbConfig, jwtConfig, redisConfig, scraperConfig],
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
          logger.log(`MongoDB connected successfully ${connectionString}`);
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
    QueueModule,
    FormulaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
