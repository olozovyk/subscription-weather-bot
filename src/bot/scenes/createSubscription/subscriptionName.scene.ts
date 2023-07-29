import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { BaseScene } from '../base.scene';
import { BotRepository } from '../../bot.repository';
import { Subscription } from '../../../entities';
import { showCancelSceneKeyboard, showMainKeyboard } from '../../keyboards';
import { cancelScene, exitScene } from '../../utils';
import { IMyContext } from '../../types';

@Scene('subscriptionName')
export class SubscriptionNameScene extends BaseScene {
  constructor(private botRepository: BotRepository) {
    super();
  }

  @SceneEnter()
  async enter(@Ctx() ctx: IMyContext) {
    try {
      if (!ctx.chat) {
        exitScene(ctx);
        return;
      }

      const chatId = ctx.chat.id;
      const user = await this.botRepository.getUserByChatId(chatId);

      if (!user) {
        await ctx.reply('User is not found');
        exitScene(ctx);
        return;
      }

      const subscriptions = await this.botRepository.getAllSubscriptions(user);
      ctx.session.subscriptions = subscriptions;

      if (subscriptions.length >= 5) {
        await ctx.reply(
          'You can add no more than 5 subscriptions.',
          showMainKeyboard(),
        );
        exitScene(ctx);
        return;
      }

      await ctx.reply(
        'What name would you like to give to your new subscription?',
        showCancelSceneKeyboard(),
      );
    } catch (e) {
      await ctx.reply(e.message);
      exitScene(ctx);
    }
  }

  @On('text')
  async setName(@Ctx() ctx: IMyContext, @Message('text') text: string) {
    if (text === '❌ Cancel') {
      await cancelScene(ctx, 'create');
      return;
    }

    const isNameExist = ctx.session.subscriptions.some(
      (subscription: Subscription) => subscription.name === text,
    );

    if (isNameExist) {
      await ctx.reply(
        'You already have a subscription with such a name. Please give an another name',
        showCancelSceneKeyboard(),
      );
      return;
    }

    ctx.session.newSubscription = {
      name: text.trim(),
    };

    ctx.scene.enter('askLocation');
  }
}
