import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { postgresConfig } from './common/DBConfigs';
import { BotModule } from './modules/bot/bot.module';
import { HttpModule } from './common/http/http.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(postgresConfig),
    BotModule,
    HttpModule,
    TasksModule,
    SubscriptionsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
