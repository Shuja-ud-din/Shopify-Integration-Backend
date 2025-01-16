import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EnvValidationSchema } from './validations/env.validation';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './modules/product/product.module';
import mongoose from 'mongoose';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    // Config Module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV || 'development'}`
        : '.env',
      validationSchema: EnvValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    // MongoDB Module
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const logger = new Logger('MongoDB');
        const connectionString = process.env.MONGO_URI;

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
