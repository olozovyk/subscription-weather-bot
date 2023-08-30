import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { postgresConfig } from './common/DBConfigs';
import { BotModule } from './modules/bot/bot.module';
import { HttpModule } from './common/http/http.module';
import { CronModule } from './modules/cron/cron.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(postgresConfig),
    BotModule,
    HttpModule,
    CronModule,
    SubscriptionModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
