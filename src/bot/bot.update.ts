import {
  Command,
  Ctx,
  Help,
  InjectBot,
  Message,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { parseCreateSubscriptionString, validateTime } from '../common/utils';
import { HttpService } from '../http/http.service';
import { ConfigService } from '@nestjs/config';

@Update()
export class BotUpdate {
  constructor(
    @InjectBot() private bot: Telegraf,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.bot.telegram.setMyCommands([
      { command: 'help', description: 'Get help' },
      { command: 'new', description: 'Create a new subscription' },
      { command: 'delete', description: 'Delete an existing subscription' },
      { command: 'timezone', description: 'Set timezone' },
    ]);
  }

  @Start()
  async start(@Ctx() ctx: Context) {
    // save user to DB?
    await ctx.reply(
      'In this bot you can create a subscription to get the weather forecast in the time you want',
    );
  }

  @Help()
  async help(@Ctx() ctx: Context) {
    await ctx.reply('Before you create your new subscription...');
  }

  @Command('new')
  async createSubscription(@Ctx() ctx: Context, @Message('text') text: string) {
    const arrayFromString = parseCreateSubscriptionString(text);

    if (arrayFromString.length < 3) {
      await ctx.reply('Enter complete information. See /help');
      return;
    }

    const [name, time, location] = arrayFromString;

    interface ISubscriptionInfo {
      time: string;
      name: string;
      location: string;
      coordinates: string;
    }

    const subscriptionInfo: Partial<ISubscriptionInfo> = {
      name,
    };

    if (!validateTime(time)) {
      await ctx.reply('Enter time with correct format');
      return;
    }

    subscriptionInfo.time = time;

    const geocodingUrl = this.configService.getOrThrow('GEOCODING_API_URL');
    const openWeatherApiKey = this.configService.getOrThrow(
      'OPEN_WEATHER_API_KEY',
    );
    const url = `${geocodingUrl}q=${location}&appid=${openWeatherApiKey}`;
    const locations = await this.httpService.get(url);
  }
}
