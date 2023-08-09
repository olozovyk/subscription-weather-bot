import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ScheduleModule.forRoot(), RabbitMQModule, ConfigModule],
  providers: [TaskService, TaskRepository],
})
export class TaskModule {}
