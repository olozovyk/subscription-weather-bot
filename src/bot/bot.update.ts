import { Command, Ctx, Help, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Update()
export class BotUpdate {
  constructor(@InjectBot() private bot: Telegraf) {
    this.bot.telegram.setMyCommands([
      { command: 'help', description: 'Get help' },
      { command: 'new', description: 'Create a new subscription' },
      { command: 'delete', description: 'Delete an existing subscription' },
      { command: 'timezone', description: 'Set timezone' },
    ]);
  }

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply(
      'In this bot you can create a subscription to get the weather forecast in the time you want',
    );
  }

  @Help()
  async help(@Ctx() ctx: Context) {
    await ctx.reply('Before you create your new subscription...');
  }

  @Command('new')
  async on(@Ctx() ctx: Context) {
    await ctx.reply('You will be creating your subscriptions here');
  }
}
