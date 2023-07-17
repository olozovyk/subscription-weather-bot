import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';

async function bootstrap() {
  process.env.TZ = 'UTC';
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
