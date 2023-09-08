import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { BaseScene } from '../base.scene';
import { showCancelSceneKeyboard, showMainKeyboard } from '../../keyboards';
import { exitScene, getChatId, isSceneCanceled } from '../../utils';
import { IMyContext } from '../../types';
import { messages } from '../../messages';
import { logCaughtError } from '../../../../common/utils';
import { Logger } from '@nestjs/common';
import { SubscriptionService } from '../../../subscription/subscription.service';

@Scene('deleteSubscriptionScene')
export class DeleteSubscriptionScene extends BaseScene {
  constructor(private readonly subscriptionsService: SubscriptionService) {
    super();
  }

  private logger = new Logger(DeleteSubscriptionScene.name);

  @SceneEnter()
  async enter(@Ctx() ctx: IMyContext) {
    await ctx.reply(
      messages.whichSubscriptionDelete,
      showCancelSceneKeyboard(),
    );
  }

  @On('text')
  async deleteSubscription(
    @Ctx() ctx: IMyContext,
    @Message('text') text: string,
  ) {
    try {
      if (await isSceneCanceled(ctx, text, 'delete')) return;

      const chatId = getChatId(ctx, true);
      if (!chatId) return;

      const subscription =
        await this.subscriptionsService.getSubscriptionByName(text, chatId);

      if (!subscription) {
        await ctx.reply(
          messages.subscriptionDoesNotExist,
          showCancelSceneKeyboard(),
        );
        return;
      }

      await this.subscriptionsService.deleteSubscription(subscription);
      await ctx.reply(messages.successfulDeleting, showMainKeyboard());
      exitScene(ctx);
    } catch (e) {
      logCaughtError(e, this.logger);
      exitScene(ctx);
    }
  }
}
