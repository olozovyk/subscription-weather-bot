import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { IMyContext } from '../../types/myContext.interface';
import { showCancelSceneKeyboard } from '../../keyboards/cancelScene.keyboard';
import { cancelScene } from '../../utils/cancelScene';
import { validateTime } from '../../../common/utils';
import { convertStringToDate } from '../../../common/utils/convertStringToDate';
import { showMainKeyboard } from '../../keyboards/main.keyboard';

@Scene('timeScene')
export class TimeScene {
  @SceneEnter()
  async enter(@Ctx() ctx: IMyContext) {
    await ctx.reply(
      `Please set a time for your subscription, e.g., 14:27 (24-hour format). If you don't send your timezone to the bot, you should use the UTC timezone.`,
      showCancelSceneKeyboard(),
    );
  }

  @On('text')
  async saveTime(@Ctx() ctx: IMyContext, @Message('text') text: string) {
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

    // TODO: get TZ

    const date = convertStringToDate(text);

    await ctx.reply(`Your date is ${date}`, showMainKeyboard());
    ctx.scene.leave();
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
