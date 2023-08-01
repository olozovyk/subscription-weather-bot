import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { BaseScene } from '../base.scene';
import { BotRepository } from '../../bot.repository';
import { showCancelSceneKeyboard, showMainKeyboard } from '../../keyboards';
import { exitScene, isSceneCanceled } from '../../utils';
import { IMyContext } from '../../types';

@Scene('deleteSubscriptionScene')
export class DeleteSubscriptionScene extends BaseScene {
  constructor(private botRepository: BotRepository) {
    super();
  }

  @SceneEnter()
  async enter(@Ctx() ctx: IMyContext) {
    await ctx.reply(
      `Which subscription would you like to delete? Specify a name for the subscription.`,
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
        await ctx.reply('A subscription with such a name is not existed.');
        return;
      }

      await this.botRepository.deleteSubscription(subscription);
      await ctx.reply('The subscription is deleted', showMainKeyboard());
      exitScene(ctx);
    } catch (e) {
      await ctx.reply(e.message);
      exitScene(ctx);
    }
  }
}
