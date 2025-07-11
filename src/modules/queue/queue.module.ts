import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { QUEUE_NAME } from '@/common/constants/constants';

import { ProcessorModule } from './processor/processor.module';
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
    ProcessorModule,
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
