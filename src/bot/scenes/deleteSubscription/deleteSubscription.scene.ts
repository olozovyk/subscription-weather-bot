import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { BaseScene } from '../base.scene';
import { BotRepository } from '../../bot.repository';
import { showCancelSceneKeyboard, showMainKeyboard } from '../../keyboards';
import { exitScene, isSceneCanceled } from '../../utils';
import { IMyContext } from '../../types';
import { messages } from '../../messages';
import { logCaughtError } from '../../../common/utils';
import { Logger } from '@nestjs/common';

@Scene('deleteSubscriptionScene')
export class DeleteSubscriptionScene extends BaseScene {
  constructor(private botRepository: BotRepository) {
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

      const subscription = await this.botRepository.getSubscriptionByName(text);

      if (!subscription) {
        await ctx.reply(
          messages.subscriptionDoesNotExist,
          showCancelSceneKeyboard(),
        );
        return;
      }

      await this.botRepository.deleteSubscription(subscription);
      await ctx.reply(messages.successfulDeleting, showMainKeyboard());
      exitScene(ctx);
    } catch (e) {
      logCaughtError(e, this.logger);
      exitScene(ctx);
    }
  }
}
