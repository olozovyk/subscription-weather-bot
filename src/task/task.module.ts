import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [TaskService, TaskRepository],
})
export class TaskModule {}
