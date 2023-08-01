import {
  Ctx,
  Hears,
  Help,
  InjectBot,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { IMyContext } from './types/myContext.interface';
import { showMainKeyboard } from './keyboards/main.keyboard';
import { BotRepository } from './bot.repository';
import { Logger } from '@nestjs/common';
import { convertDateToInputString } from '../common/utils/convertDateToInputString';
import { Subscription } from '../entities/subscription.entity';
import { User } from '../entities/user.entity';
import { getChatId } from './utils/getChatId';
import { messages } from './messages';
import { logCaughtError } from '../common/utils';

@Update()
export class BotService {
  constructor(
    @InjectBot() private bot: Telegraf,
    private botRepository: BotRepository,
  ) {}

  private logger = new Logger(BotService.name);

  @Start()
  async start(@Ctx() ctx: IMyContext) {
    await this.startHandler(ctx);
  }

  @Help()
  @Hears('Help')
  async help(@Ctx() ctx: IMyContext) {
    await this.helpHandler(ctx);
  }

  @Hears('New subscription')
  async createSubscription(@Ctx() ctx: IMyContext) {
    await ctx.scene.enter('subscriptionName');
  }

  @Hears('Set timezone')
  async setTimezone(@Ctx() ctx: IMyContext) {
    await ctx.scene.enter('timezoneScene');
  }

  @Hears('All subscriptions')
  async showSubscriptions(@Ctx() ctx: IMyContext) {
    await this.getSubscriptionsHandler(ctx);
  }

  @Hears('Delete subscription')
  async deleteSubscription(@Ctx() ctx: IMyContext) {
    await ctx.scene.enter('deleteSubscriptionScene');
  }

  @On('audio')
  @On('voice')
  @On('video')
  @On('photo')
  @On('document')
  @On('sticker')
  @On('text')
  async answerDefault(@Ctx() ctx: IMyContext) {
    await ctx.reply(messages.makeChoice, showMainKeyboard());
  }

  private async setMenu() {
    await this.bot.telegram.setMyCommands([
      { command: 'start', description: 'Start the bot' },
      { command: 'help', description: 'Get help' },
    ]);
  }

  private async startHandler(ctx: IMyContext) {
    const chatId = getChatId(ctx);
    if (!chatId) return;

    try {
      const existingUser = await this.botRepository.getUserByChatId(chatId);

      if (!existingUser) {
        await this.botRepository.saveUser({ chatId });
      }

      await this.setMenu();
      await ctx.reply(messages.start, showMainKeyboard());
    } catch (e) {
      logCaughtError(e, this.logger);
    }
  }

  private async getSubscriptionsHandler(ctx: IMyContext) {
    try {
      const chatId = getChatId(ctx);
      if (!chatId) return;

      const user = await this.botRepository.getUserByChatId(chatId);

      if (!user) {
        this.logger.error('User is not found');
        return;
      }

      const subscriptions = await this.botRepository.getAllSubscriptions(user);

      if (!subscriptions.length) {
        await ctx.reply(messages.noSubscriptions, showMainKeyboard());
        return;
      }

      const subscriptionsMessage = messages.getAllSubscriptionsMessage(
        subscriptions,
        user,
      );

      await ctx.reply(subscriptionsMessage, showMainKeyboard());
    } catch (e) {
      logCaughtError(e, this.logger);
    }
  }

  private async helpHandler(ctx: IMyContext) {
    await ctx.reply(messages.help, showMainKeyboard());
  }
}
