import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { getBotToken } from 'nestjs-telegraf';
import * as process from 'process';

async function bootstrap() {
  process.env.TZ = 'UTC';
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  if (process.env.NODE_ENV !== 'development') {
    const bot = app.get(getBotToken());
    app.use(bot.webhookCallback('/bot/update'));
  }

  const PORT = configService.getOrThrow('PORT');
  await app.listen(PORT);
}
bootstrap();
