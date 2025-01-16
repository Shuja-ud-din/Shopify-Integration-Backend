import { Module } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

const logger = new Logger('RedisProvider');

const RedisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_DB } = process.env;

    const client = new Redis({
      host: REDIS_HOST,
      port: Number(REDIS_PORT),
      password: REDIS_PASSWORD,
      db: Number(REDIS_DB),
    });

    client.on('connect', () => {
      logger.log(`Redis connected successfully to ${REDIS_HOST}:${REDIS_PORT}`);
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
