import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { QUEUE_NAME } from '@/common/constants/constants';
import { ISchedule } from '@/common/types/schedule.types';
import { getDelay } from '@/common/utils/dateTime';

@Injectable()
export class QueueService {
  constructor(@InjectQueue(QUEUE_NAME) private messageQueue: Queue) {}

  async scheduleJob(
    schedule: ISchedule,
    groupId: string,
    storeId: string,
  ): Promise<string> {
    const jobId = `job-${groupId}-${schedule.runCount}`;

    const delay = getDelay(
      schedule.startDate,
      schedule.startTime,
      schedule.timezone,
    );

    await this.messageQueue.add(
      jobId,
      { groupId, storeId },
      {
        delay,
      },
    );

    return jobId;
  }

  async cancelJob(jobId: string): Promise<void> {
    const job = await this.messageQueue.getJob(jobId);
    if (job) {
      await job.remove();
    }
  }

  async cancelAllJobs(groupId: string): Promise<void> {
    const jobs = await this.messageQueue.getJobs([
      'waiting',
      'active',
      'failed',
    ]);
    for (const job of jobs) {
      if (job.id.startsWith(`job-${groupId}`)) {
        await job.remove();
      }
    }
  }
}
