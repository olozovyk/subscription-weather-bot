import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { Logger } from '@nestjs/common';

import { BaseScene } from '../base.scene';
import { showCancelSceneKeyboard, showMainKeyboard } from '../../keyboards';
import { exitScene, getChatId, isSceneCanceled } from '../../utils';
import {
  convertInputStringToDate,
  logCaughtError,
  validateTime,
} from '../../../../common/utils';
import { Location, Subscription } from '../../../subscription/entities';
import { IMyContext } from '../../types';
import { messages } from '../../messages';
import { SubscriptionService } from '../../../subscription/subscription.service';
import { UserService } from '../../../user/user.service';

@Scene('timeScene')
export class TimeScene extends BaseScene {
  constructor(
    private readonly subscriptionsService: SubscriptionService,
    private readonly usersService: UserService,
  ) {
    super();
  }

  private logger = new Logger(TimeScene.name);

  @SceneEnter()
  async enter(@Ctx() ctx: IMyContext) {
    await ctx.reply(messages.askTime, showCancelSceneKeyboard());
  }

  @On('text')
  async saveTime(@Ctx() ctx: IMyContext, @Message('text') text: string) {
    try {
      if (await isSceneCanceled(ctx, text, 'create')) return;

      if (!validateTime(text)) {
        await ctx.reply(
          messages.timeFormatIsNotValid,
          showCancelSceneKeyboard(),
        );
        return;
      }

      const chatId = getChatId(ctx, true);
      if (!chatId) return;

      const user = await this.usersService.getUserByChatId(chatId);

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

      await this.subscriptionsService.saveSubscription(subscription);

      await ctx.reply(
        messages.getSubscriptionSummary(
          location.name,
          location.country,
          timeLocal,
        ),
        showMainKeyboard(),
      );

      exitScene(ctx);
    } catch (e) {
      logCaughtError(e, this.logger);
      exitScene(ctx);
    }
  }
}
