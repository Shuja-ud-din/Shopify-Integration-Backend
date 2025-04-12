import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QUEUE_NAME } from 'src/common/constants/constants';

import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAME,
    }),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
