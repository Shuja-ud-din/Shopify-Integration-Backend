import { Module } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

const logger = new Logger('RedisProvider');

const RedisProvider = {
  provide: 'REDIS_CLIENT',
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const { host, port, password } = configService.get('redis');

    const client = new Redis({
      host,
      port: Number(port),
      password,
    });

    client.on('connect', () => {
      logger.log(`Redis connected successfully to ${host}:${port}`);
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
