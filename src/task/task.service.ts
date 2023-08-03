import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { getCurrentUTCTime } from '../common/utils';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  private logger = new Logger(TaskService.name);

  @Cron('00 * * * * *')
  async handleCron() {
    const { hours, minutes } = getCurrentUTCTime();

    this.logger.debug(`The task executed`);

    const subscriptions = await this.taskRepository.getSubscriptionsByTime(
      hours,
      minutes,
    );

    subscriptions.forEach(item => {
      this.logger.log(JSON.stringify(item));
    });
  }
}
