import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QUEUE_NAME } from 'src/common/constants/constants';

import { QueueService } from './queue.service';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          url: configService.get<string>('redis.url'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: QUEUE_NAME,
    }),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
