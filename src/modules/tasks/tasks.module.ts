import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [ScheduleModule.forRoot(), SubscriptionsModule],
  providers: [TasksService],
})
export class TasksModule {}
