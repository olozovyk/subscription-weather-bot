import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { getCurrentUTCTime } from '../common/utils';
import { TaskRepository } from './task.repository';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly rabbitMQService: RabbitMQService,
    private readonly configService: ConfigService,
  ) {}

  private logger = new Logger(TaskService.name);

  private rabbitSendOptions = {
    exchangeType: this.configService.getOrThrow('EXCHANGE_TYPE'),
    exchangeName: this.configService.getOrThrow('EXCHANGE_NAME'),
    queue: this.configService.getOrThrow('QUEUE'),
    routingKey: this.configService.getOrThrow('ROUTING_KEY'),
  };

  @Cron('00 * * * * *')
  async handleCron() {
    const { hours, minutes } = getCurrentUTCTime();

    this.logger.debug(`The task executed`);

    const subscriptions = await this.taskRepository.getSubscriptionsByTime(
      hours,
      minutes,
    );

    subscriptions.forEach(item => {
      this.rabbitMQService.sendToQueue({
        ...this.rabbitSendOptions,
        payload: JSON.stringify(item),
      });
      this.logger.log(JSON.stringify(item));
    });
  }
}
