import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as LocalSession from 'telegraf-session-local';

import { BotService } from './bot.service';
import { HttpModule } from '../http/http.module';
import {
  AskLocationScene,
  SaveLocationScene,
  SubscriptionNameScene,
  TimeScene,
} from './scenes/createSubscription';
import { HttpService } from '../http/http.service';
import { BotRepository } from './bot.repository';
import { TimezoneScene } from './scenes/setTimezone';
import { DeleteSubscriptionScene } from './scenes/deleteSubscription';

const sessions = new LocalSession({ database: 'sessions.json' });

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.getOrThrow('BOT_TOKEN'),
        middlewares: [sessions.middleware()],
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    ConfigModule,
  ],
  providers: [
    BotService,
    HttpService,
    BotRepository,
    SubscriptionNameScene,
    AskLocationScene,
    SaveLocationScene,
    TimeScene,
    TimezoneScene,
    DeleteSubscriptionScene,
  ],
})
export class BotModule {}
