import { Module } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

const logger = new Logger('RedisProvider');

const RedisProvider = {
  provide: 'REDIS_CLIENT',
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const { url } = configService.get('redis');

    const client = new Redis(url, {
      retryStrategy: (times) => {
        if (times >= 3) {
          logger.error(
            'Max retry attempts reached. Make sure your Redis is running.',
          );
          throw new Error(
            'Max retry attempts reached. Make sure your Redis is running.',
          );
        }

        const delay = Math.min(times * 50, 2000);
        logger.warn(
          `Redis retry attempt #${times}, reconnecting in ${delay}ms`,
        );
        return delay;
      },
      reconnectOnError: (err) => {
        logger.error('Redis reconnecting due to error:', err.message);
        return true;
      },
    });

    client.on('connect', () => {
      logger.log(`Redis connected successfully to ${url}`);
    });

    client.on('error', (err) => {
      logger.error('Redis connection error:', err);
    });

    return client;
  },
};

@Module({
  providers: [RedisProvider],
  exports: [RedisProvider],
})
export class RedisModule {}
