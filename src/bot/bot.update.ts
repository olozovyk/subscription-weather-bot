import { Ctx, Hears, Help, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { IMyContext } from './types/myContext.interface';
import { showMainKeyboard } from './keyboards/main.keyboard';
import { BotRepository } from './bot.repository';

@Update()
export class BotUpdate {
  constructor(
    @InjectBot() private bot: Telegraf,
    private botRepository: BotRepository,
  ) {}

  // TODO: add to DB basic user info
  @Start()
  async start(@Ctx() ctx: IMyContext) {
    if (!ctx.chat) {
      return;
    }

    const chatId = ctx.chat.id;

    const existingUser = await this.botRepository.getUserByChatId(chatId);

    if (!existingUser) {
      await this.botRepository.saveUser({ chatId });
    }

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
}
