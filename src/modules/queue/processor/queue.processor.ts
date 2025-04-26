import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Job, Worker } from 'bullmq';
import Redis from 'ioredis';
import { QUEUE_NAME } from 'src/common/constants/constants';
import { EndScheduleOn } from 'src/common/enums/schedule.enum';
import { ProductGroupService } from 'src/modules/product-group/product-group.service';

@Injectable()
export class QueueProcessor implements OnModuleInit {
  private readonly logger = new Logger(QueueProcessor.name);

  constructor(
    private productGroupService: ProductGroupService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  onModuleInit() {
    const worker = new Worker<{ groupId: string }>(
      QUEUE_NAME,
      async (job: Job) => {
        const { groupId, storeId } = job.data;
        this.logger.log(`⏰ Executing job ${job.id} for group ${groupId}`);
        await this.handleJob(groupId, storeId);
        this.logger.log(`✅ Job ${job.id} completed`);
      },
      {
        connection: this.redisClient.duplicate(), // Always use a duplicate connection
      },
    );

    worker.on('failed', (job, err) => {
      this.logger.error(`❌ Job ${job?.id} failed: ${err.message}`);
    });
  }

  private async handleJob(groupId: string, storeId: string): Promise<void> {
    console.log(`🚀 Running scheduled task for group: ${groupId}`);

    try {
      const productGroup = await this.productGroupService.getProductGroup(
        storeId,
        groupId,
      );

      await this.productGroupService.scrapeProductGroup(storeId, groupId);
      this.logger.log(`✅ Successfully processed job for group ${groupId}`);

      productGroup.schedule.runCount += 1;
      await productGroup.save();

      const { schedule } = productGroup;

      if (schedule.end.on === EndScheduleOn.CANCELLED) {
        this.logger.log(`⏰ Rescheduling job ${groupId} for next run`);
        this.productGroupService.scheduleProductGroup(
          storeId,
          groupId,
          schedule,
        );
      } else {
        if (schedule.end.on === EndScheduleOn.COUNT) {
          if (schedule.runCount < schedule.end.value) {
            this.logger.log(`⏰ Rescheduling job ${groupId} for next run`);
            this.productGroupService.scheduleProductGroup(
              storeId,
              groupId,
              schedule,
            );
          } else {
            this.logger.log(`❌ Job ${groupId} has reached its end condition`);
            return;
          }
        }
      }
    } catch (error) {
      this.logger.error(
        `❌ Error processing job for group ${groupId}: ${error.message}`,
      );
    }
  }
}
