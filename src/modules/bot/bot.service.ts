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
import { Logger } from '@nestjs/common';

import { IMyContext } from './types';
import { showMainKeyboard } from './keyboards';
import { getChatId } from './utils';
import { messages } from './messages';
import { logCaughtError } from '../../common/utils';
import { SubscriptionService } from '../subscription/subscription.service';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';

@Update()
export class BotService {
  constructor(
    @InjectBot() private bot: Telegraf,
    private readonly subscriptionsService: SubscriptionService,
    private readonly usersService: UserService,
    private readonly configService: ConfigService,
  ) {}

  private logger = new Logger(BotService.name);
  private INTRO_IMAGE = this.configService.get('INTRO_IMAGE');

  @Start()
  async start(@Ctx() ctx: IMyContext) {
    this.logger.log(JSON.stringify(await this.bot.telegram.getWebhookInfo()));
    await this.startHandler(ctx);
  }

  @Help()
  @Hears('Help')
  async help(@Ctx() ctx: IMyContext) {
    await this.helpHandler(ctx);
  }

  @Hears('New Subscription')
  async createSubscription(@Ctx() ctx: IMyContext) {
    await ctx.scene.enter('subscriptionName');
  }

  @Hears('Set Timezone')
  async setTimezone(@Ctx() ctx: IMyContext) {
    await ctx.scene.enter('timezoneScene');
  }

  @Hears('All Subscriptions')
  async showSubscriptions(@Ctx() ctx: IMyContext) {
    await this.getSubscriptionsHandler(ctx);
  }

  @Hears('Delete Subscription')
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
      const existingUser = await this.usersService.getUserByChatId(chatId);

      if (!existingUser) {
        await this.usersService.saveUser({ chatId });
      }

      await this.setMenu();

      if (this.INTRO_IMAGE) {
        await ctx.replyWithPhoto(this.INTRO_IMAGE);
      }

      await ctx.replyWithHTML(messages.start, showMainKeyboard());
    } catch (e) {
      logCaughtError(e, this.logger);
    }
  }

  private async getSubscriptionsHandler(ctx: IMyContext) {
    try {
      const chatId = getChatId(ctx);
      if (!chatId) return;

      const user = await this.usersService.getUserByChatId(chatId);

      if (!user) {
        this.logger.error('User is not found');
        return;
      }

      const subscriptions =
        await this.subscriptionsService.getAllSubscriptionsByUser(user);

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
    await ctx.replyWithHTML(messages.help, showMainKeyboard());
  }
}
