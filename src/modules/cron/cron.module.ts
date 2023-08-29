import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [ScheduleModule.forRoot(), SubscriptionModule],
  providers: [CronService],
})
export class CronModule {}
