import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BotModule } from './bot/bot.module';
import { HttpModule } from './http/http.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresConfig } from './common/DBConfigs';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({ ...postgresConfig }),
    BotModule,
    HttpModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
