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

@Update()
export class BotUpdate {
  constructor(
    @InjectBot() private bot: Telegraf,
    private botRepository: BotRepository,
  ) {}

  private logger = new Logger(BotUpdate.name);

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

  @Hears('Set timezone')
  async setTimezone(@Ctx() ctx: IMyContext) {
    await ctx.scene.enter('timezoneScene');
  }

  @Hears('All subscriptions')
  async showSubscriptions(@Ctx() ctx: IMyContext) {
    if (!ctx.chat) return;

    const user = await this.botRepository.getUserByChatId(ctx.chat.id);

    if (!user) {
      this.logger.error('User is not found');
      return;
    }

    const subscriptions = await this.botRepository.getAllSubscriptions(user);

    if (!subscriptions.length) {
      await ctx.reply(
        `You don't have active subscriptions`,
        showMainKeyboard(),
      );
      return;
    }

    let subscriptionMessage = 'You have next subscriptions:' + '\n\n';

    subscriptions.map(async (subscription, idx) => {
      const {
        name,
        time,
        location: { name: locationName, country, state },
      } = subscription;

      const timeToShow = convertDateToInputString(time, user.timezone);

      subscriptionMessage += `Name: ${name} \nTime: ${timeToShow} \nLocation: ${locationName}, ${country}`;

      if (state) {
        subscriptionMessage += ` ${state}`;
      }

      if (idx !== subscriptions.length - 1) {
        subscriptionMessage += '\n\n';
      }
    });

    await ctx.reply(subscriptionMessage, showMainKeyboard());
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
    await ctx.reply('Please make your choice', showMainKeyboard());
  }

  // TODO: is it necessary?
  private async setMenu() {
    await this.bot.telegram.setMyCommands([
      { command: 'help', description: 'Get help' },
    ]);
  }
}
