import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { SubscriptionModule } from '../subscription/subscription.module';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [ScheduleModule.forRoot(), SubscriptionModule, BotModule],
  providers: [CronService],
})
export class CronModule {}
