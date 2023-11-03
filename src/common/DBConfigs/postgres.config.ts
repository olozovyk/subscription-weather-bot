import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const configService = new ConfigService();

export const postgresConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.getOrThrow('POSTGRES_HOST'),
  port: Number(configService.getOrThrow('POSTGRES_PORT')),
  username: configService.getOrThrow('POSTGRES_USER_NAME'),
  password: configService.getOrThrow('POSTGRES_PASSWORD'),
  database: configService.getOrThrow('POSTGRES_DB_NAME'),
  synchronize: true,
  entities: ['dist/**/*.entity.js'],
};
