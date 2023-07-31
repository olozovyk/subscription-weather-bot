import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { BaseScene } from '../base.scene';
import { BotRepository } from '../../bot.repository';
import { showCancelSceneKeyboard, showMainKeyboard } from '../../keyboards';
import { cancelScene, exitScene } from '../../utils';
import {
  convertInputStringToDate,
  getTimeToShow,
  validateTime,
} from '../../../common/utils';
import { Location, Subscription } from '../../../entities';
import { IMyContext } from '../../types';

@Scene('timeScene')
export class TimeScene extends BaseScene {
  constructor(private botRepository: BotRepository) {
    super();
  }

  @SceneEnter()
  async enter(@Ctx() ctx: IMyContext) {
    await ctx.reply(
      `Please set a time for your subscription, e.g., 14:27 (24-hour format). If you don't send your timezone to the bot, you should use the UTC timezone.`,
      showCancelSceneKeyboard(),
    );
  }

  @On('text')
  async saveTime(@Ctx() ctx: IMyContext, @Message('text') text: string) {
    try {
      if (text === '❌ Cancel') {
        await cancelScene(ctx, 'create');
        return;
      }

      if (!validateTime(text)) {
        await ctx.reply(
          'Please set a time for your subscription, e.g., 14:30 (24-hour format)',
          showCancelSceneKeyboard(),
        );
        return;
      }

      if (!ctx.chat) {
        return;
      }

      const user = await this.botRepository.getUserByChatId(ctx.chat.id);

      if (!user) {
        return;
      }

      const { timeLocal, timeUTC } = convertInputStringToDate(
        text,
        user.timezone,
      );

      ctx.session.newSubscription.time = timeUTC;

      const location = new Location();
      location.name = ctx.session.newSubscription.location.name;
      location.country = ctx.session.newSubscription.location.country;
      location.latitude = ctx.session.newSubscription.location.lat;
      location.longitude = ctx.session.newSubscription.location.lon;

      if (ctx.session.newSubscription.location.state) {
        location.state = ctx.session.newSubscription.location.state;
      }

      const subscription = new Subscription();
      subscription.name = ctx.session.newSubscription.name;
      subscription.time = ctx.session.newSubscription.time;
      subscription.location = location;
      subscription.user = user;

      await this.botRepository.saveSubscription(subscription);

      await ctx.reply(
        `You scheduled a subscription for ${location.name} ${
          location.country
        } to be sent weather forecast at ${getTimeToShow(timeLocal)}`,
        showMainKeyboard(),
      );

      exitScene(ctx);
    } catch (e) {
      await ctx.reply(e.message);
      exitScene(ctx);
    }
  }
}
