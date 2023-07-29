import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BotModule } from './bot/bot.module';
import { HttpModule } from './http/http.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresConfig } from './common/DBConfigs';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BotModule,
    HttpModule,
    TypeOrmModule.forRoot({ ...postgresConfig }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
