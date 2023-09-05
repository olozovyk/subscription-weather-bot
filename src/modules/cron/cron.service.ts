import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

import { SubscriptionService } from '../subscription/subscription.service';
import { getCurrentUTCTime } from '../../common/utils';
import { DeliveryWeatherService } from '../bot/deliveryWeather.service';

@Injectable()
export class CronService {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly configService: ConfigService,
    private readonly deliveryWeatherService: DeliveryWeatherService,
  ) {}

  private logger = new Logger(CronService.name);

  @Cron('00 * * * * *')
  async handleCron() {
    const { hours, minutes } = getCurrentUTCTime();

    const subscriptions = await this.subscriptionService.getSubscriptionsByTime(
      hours,
      minutes,
    );

    this.deliveryWeatherService.deliveryMessage(subscriptions);
  }
}
