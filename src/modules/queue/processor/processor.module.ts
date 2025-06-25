import { forwardRef, Module } from '@nestjs/common';

import { ProductGroupModule } from '@/modules/product-group/product-group.module';
import { RedisModule } from '@/modules/redis/redis.module';

import { QueueProcessor } from './queue.processor';

@Module({
  imports: [
    forwardRef(() => ProductGroupModule), // 🔁 fix circular dependency
    RedisModule,
  ],
  providers: [QueueProcessor],
})
export class ProcessorModule {}
