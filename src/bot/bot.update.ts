import { Ctx, Hears, Help, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Markup, Scenes, Telegraf } from 'telegraf';
import { IMyContext } from './types/myContext.interface';
import { showMainKeyboard } from './keyboards/main.keyboard';

@Update()
export class BotUpdate {
  constructor(@InjectBot() private bot: Telegraf) {}

  // TODO: add to DB basic user info
  @Start()
  async start(@Ctx() ctx: IMyContext) {
    await this.setMenu();
    await ctx.reply(
      'In this bot you can create a subscription to get the weather forecast in the time you want',
      showMainKeyboard(),
    );
  }

  // TODO:
  @Help()
  async help(@Ctx() ctx: IMyContext) {
    await ctx.reply('Before you create your new subscription...');
  }

  @Hears('New subscription')
  async createSubscription(@Ctx() ctx: IMyContext) {
    await ctx.scene.enter('subscriptionName');
  }

  // TODO: is it necessary?
  private async setMenu() {
    await this.bot.telegram.setMyCommands([
      { command: 'help', description: 'Get help' },
      { command: 'timezone', description: 'Set timezone' },
    ]);
  }
  // @Command('new')
  // async createSubscription(@Ctx() ctx: Context, @Message('text') text: string) {
  //   const arrayFromString = parseCreateSubscriptionString(text);
  //
  //   if (arrayFromString.length < 3) {
  //     await ctx.reply('Enter complete information. See /help');
  //     return;
  //   }
  //
  //   const [name, time, location] = arrayFromString;
  //
  //   interface ISubscriptionInfo {
  //     time: string;
  //     name: string;
  //     location: string;
  //     coordinates: string;
  //   }
  //
  //   const subscriptionInfo: Partial<ISubscriptionInfo> = {
  //     name,
  //   };
  //
  //   if (!validateTime(time)) {
  //     await ctx.reply('Enter time with correct format');
  //     return;
  //   }
  //
  //   subscriptionInfo.time = time;
  //
  //   const geocodingUrl = this.configService.getOrThrow('GEOCODING_API_URL');
  //   const openWeatherApiKey = this.configService.getOrThrow(
  //     'OPEN_WEATHER_API_KEY',
  //   );
  //   const url = `${geocodingUrl}q=${location}&appid=${openWeatherApiKey}`;
  //   const locations = await this.httpService.get(url);
  // }
}
