import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { EnvValidationSchema } from './validations/env.validation';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './modules/product/product.module';
import { RedisModule } from './modules/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import appConfig from './common/config/app.config';
import jwtConfig from './common/config/jwt.config';
import dbConfig from './common/config/db.config';
import redisConfig from './common/config/redis.config';
import { SeedModule } from './modules/seed/seed.module';
import shopifyConfig from './common/config/shopify.config';

@Module({
  imports: [
    // Config Module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env'
          : `.env.${process.env.NODE_ENV || 'development'}`,
      load: [appConfig, dbConfig, jwtConfig, redisConfig, shopifyConfig],
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
