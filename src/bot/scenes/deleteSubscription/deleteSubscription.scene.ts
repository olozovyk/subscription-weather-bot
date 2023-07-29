import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { BaseScene } from '../base.scene';
import { BotRepository } from '../../bot.repository';
import { showCancelSceneKeyboard, showMainKeyboard } from '../../keyboards';
import { cancelScene, exitScene } from '../../utils';
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
      if (text === '❌ Cancel') {
        await cancelScene(ctx, 'create');
        return;
      }

      const subscription = await this.botRepository.getSubscriptionByName(text);

      if (!subscription) {
        return ctx.reply('A subscription with such a name is not existed.');
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
