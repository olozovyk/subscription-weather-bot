import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotUpdate } from './bot.update';
import { HttpModule } from '../http/http.module';
import { SubscriptionNameScene } from './scenes/createSubscription/subscriptionName.scene';
import * as LocalSession from 'telegraf-session-local';
import { AskLocationScene } from './scenes/createSubscription/askLocation.scene';
import { HttpService } from '../http/http.service';
import { SaveLocationScene } from './scenes/createSubscription/saveLocation.scene';
import { TimeScene } from './scenes/createSubscription/time.scene';
import { BotRepository } from './bot.repository';
import { TimezoneScene } from './scenes/setTimezone/timezone.scene';

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
    BotUpdate,
    HttpService,
    BotRepository,
    SubscriptionNameScene,
    AskLocationScene,
    SaveLocationScene,
    TimeScene,
    TimezoneScene,
  ],
})
export class BotModule {}
