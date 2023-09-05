import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as LocalSession from 'telegraf-session-local';

import { BotService } from './bot.service';
import { HttpModule } from '../../common/http/http.module';
import {
  AskLocationScene,
  SaveLocationScene,
  SubscriptionNameScene,
  TimeScene,
} from './scenes/createSubscription';
import { HttpService } from '../../common/http/http.service';
import { TimezoneScene } from './scenes/setTimezone';
import { DeleteSubscriptionScene } from './scenes/deleteSubscription';
import { SubscriptionModule } from '../subscription/subscription.module';
import { UserModule } from '../user/user.module';
import { DeliveryWeatherService } from './deliveryWeather.service';

const sessions = new LocalSession({ database: 'sessions.json' });

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule, SubscriptionModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.getOrThrow('BOT_TOKEN'),
        middlewares: [sessions.middleware()],
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    ConfigModule,
    SubscriptionModule,
    UserModule,
  ],
  providers: [
    BotService,
    HttpService,
    SubscriptionNameScene,
    AskLocationScene,
    SaveLocationScene,
    TimeScene,
    TimezoneScene,
    DeleteSubscriptionScene,
    DeliveryWeatherService,
  ],
  exports: [DeliveryWeatherService],
})
export class BotModule {}
