import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

import { SubscriptionService } from '../subscription/subscription.service';
import { getCurrentUTCTime } from '../../common/utils';

@Injectable()
export class CronService {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly configService: ConfigService,
  ) {}

  private logger = new Logger(CronService.name);

  @Cron('00 * * * * *')
  async handleCron() {
    const { hours, minutes } = getCurrentUTCTime();

    this.logger.debug(`The task executed`);

    const subscriptions = await this.subscriptionService.getSubscriptionsByTime(
      hours,
      minutes,
    );

    subscriptions.forEach(item => {
      // TODO: run method from the bot module for delivering a forecast
      this.logger.log(JSON.stringify(item));
    });
  }
}
