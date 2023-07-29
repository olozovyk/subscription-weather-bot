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

@Update()
export class BotUpdate {
  constructor(
    @InjectBot() private bot: Telegraf,
    private botRepository: BotRepository,
  ) {}

  private logger = new Logger(BotUpdate.name);

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
    await ctx.reply('Please make your choice', showMainKeyboard());
  }

  private async setMenu() {
    await this.bot.telegram.setMyCommands([
      { command: 'start', description: 'Start the bot' },
      { command: 'help', description: 'Get help' },
    ]);
  }

  private async startHandler(ctx: IMyContext) {
    if (!ctx.chat) {
      return;
    }
    const chatId = ctx.chat.id;

    try {
      const existingUser = await this.botRepository.getUserByChatId(chatId);

      if (!existingUser) {
        await this.botRepository.saveUser({ chatId });
      }

      await this.setMenu();
      await ctx.reply(
        'In this bot you can create a subscription to get the weather forecast in the time you want',
        showMainKeyboard(),
      );
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  private async getSubscriptionsHandler(ctx: IMyContext) {
    try {
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

      const subscriptionsMessage = this.getSubscriptionsMessage(
        subscriptions,
        user,
      );

      await ctx.reply(subscriptionsMessage, showMainKeyboard());
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  private getSubscriptionsMessage(
    subscriptions: Subscription[],
    user: User,
  ): string {
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

    return subscriptionMessage;
  }

  private async helpHandler(ctx: IMyContext) {
    await ctx.reply(
      'In this bot you can create subscriptions to receive the weather forecast at the time you want.\n' +
        '\n' +
        'To create a subscription press the button "New subscription" and follow the instructions.\n' +
        '\n' +
        'By default the bot saves a time in the UTC format. To save a time in your timezone you should set a timezone by pressing the button “Set timezone”.\n' +
        '\n' +
        'You can create up to 5 subscriptions.',
    );
  }
}
