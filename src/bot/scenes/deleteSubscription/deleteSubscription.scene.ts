import { BaseScene } from '../base.scene';
import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { IMyContext } from '../../types/myContext.interface';
import { showCancelSceneKeyboard } from '../../keyboards/cancelScene.keyboard';
import { cancelScene, exitScene } from '../../utils/cancelScene';
import { BotRepository } from '../../bot.repository';
import { showMainKeyboard } from '../../keyboards/main.keyboard';

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
  }
}
