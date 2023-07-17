import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BotModule } from './bot/bot.module';
import { HttpModule } from './http/http.module';

@Module({
  imports: [ConfigModule.forRoot(), BotModule, HttpModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
