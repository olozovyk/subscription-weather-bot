import * as LocalSession from 'telegraf-session-local';
import { ConfigService } from '@nestjs/config';
import { TelegrafModuleOptions } from 'nestjs-telegraf';

export const getBotConfig = (
  configService: ConfigService,
): TelegrafModuleOptions => {
  const sessions = new LocalSession({ database: 'sessions.json' });

  const config: TelegrafModuleOptions = {
    token: configService.getOrThrow('BOT_TOKEN'),
    middlewares: [sessions.middleware()],
    launchOptions: {
      webhook: {
        domain: configService.getOrThrow('BOT_URL'),
        hookPath: '/bot/update',
      },
    },
  };

  if (process.env.NODE_ENV === 'development') {
    config.token = configService.getOrThrow('BOT_TOKEN_DEV');
    config.launchOptions = undefined;
  }

  return config;
};
