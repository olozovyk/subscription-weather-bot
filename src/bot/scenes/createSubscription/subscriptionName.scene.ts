import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { IMyContext } from '../../types/myContext.interface';
import { showCancelSceneKeyboard } from '../../keyboards/cancelScene.keyboard';
import { cancelScene } from '../../utils/cancelScene';

@Scene('subscriptionName')
export class SubscriptionNameScene {
  @SceneEnter()
  async enter(@Ctx() ctx: IMyContext) {
    await ctx.reply(
      'What name would you like to give to your new subscription?',
      showCancelSceneKeyboard(),
    );
  }

  @On('text')
  async setName(@Ctx() ctx: IMyContext, @Message('text') text: string) {
    if (text === '❌ Cancel') {
      await cancelScene(ctx, 'create');
      return;
    }

    // TODO: check for uniqueness

    ctx.session.newUser = {
      name: text,
    };

    ctx.scene.enter('askLocation');
  }

  @On('audio')
  @On('voice')
  @On('video')
  @On('photo')
  @On('document')
  repeatQuestion(@Ctx() ctx: IMyContext) {
    ctx.scene.reenter();
  }
}
