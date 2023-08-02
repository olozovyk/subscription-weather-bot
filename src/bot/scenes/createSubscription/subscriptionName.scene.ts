import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { Logger } from '@nestjs/common';

import { BaseScene } from '../base.scene';
import { BotRepository } from '../../bot.repository';
import { Subscription } from '../../../entities';
import { showCancelSceneKeyboard, showMainKeyboard } from '../../keyboards';
import { exitScene, getChatId, isSceneCanceled } from '../../utils';
import { IMyContext } from '../../types';
import { messages } from '../../messages';
import { logCaughtError } from '../../../common/utils';

@Scene('subscriptionName')
export class SubscriptionNameScene extends BaseScene {
  constructor(private botRepository: BotRepository) {
    super();
  }

  private logger = new Logger(SubscriptionNameScene.name);

  @SceneEnter()
  async enter(@Ctx() ctx: IMyContext) {
    try {
      const chatId = getChatId(ctx, true);
      if (!chatId) return;

      const user = await this.botRepository.getUserByChatId(chatId);

      if (!user) {
        this.logger.error('User is not found');
        exitScene(ctx);
        return;
      }

      const subscriptions = await this.botRepository.getAllSubscriptions(user);
      ctx.session.subscriptions = subscriptions;

      if (subscriptions.length >= 5) {
        await ctx.reply(messages.subscriptionsMaxOut, showMainKeyboard());
        exitScene(ctx);
        return;
      }

      await ctx.reply(messages.askSubscriptionName, showCancelSceneKeyboard());
    } catch (e) {
      logCaughtError(e, this.logger);
      exitScene(ctx);
    }
  }

  @On('text')
  async setName(@Ctx() ctx: IMyContext, @Message('text') text: string) {
    if (await isSceneCanceled(ctx, text, 'create')) return;

    const isNameExist = ctx.session.subscriptions.some(
      (subscription: Subscription) => subscription.name === text,
    );

    if (isNameExist) {
      await ctx.reply(messages.nameExists, showCancelSceneKeyboard());
      return;
    }

    ctx.session.newSubscription = {
      name: text.trim(),
    };

    ctx.scene.enter('askLocation');
  }
}
