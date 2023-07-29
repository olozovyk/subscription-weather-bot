import { BaseScene } from '../base.scene';
import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { IMyContext } from '../../types/myContext.interface';
import { showCancelSceneKeyboard } from '../../keyboards/cancelScene.keyboard';
import { cancelScene, exitScene } from '../../utils/cancelScene';
import { showMainKeyboard } from '../../keyboards/main.keyboard';
import { validateTimezone } from '../../../common/utils/validateTimezone';
import { BotRepository } from '../../bot.repository';

@Scene('timezoneScene')
export class TimezoneScene extends BaseScene {
  constructor(private botRepository: BotRepository) {
    super();
  }

  @SceneEnter()
  async enter(@Ctx() ctx: IMyContext) {
    await ctx.reply(
      `Please tell your timezone in format 'Europe/Kyiv'`,
      showCancelSceneKeyboard(),
    );
  }

  @On('text')
  async saveTimezone(@Ctx() ctx: IMyContext, @Message('text') text: string) {
    if (text === '❌ Cancel') {
      await cancelScene(ctx, 'create');
      return;
    }

    if (!validateTimezone(text)) {
      await ctx.reply(
        'Entered setTimezone is not valid. Please send another one or cancel',
        showCancelSceneKeyboard(),
      );
      return;
    }

    if (!ctx.chat) {
      exitScene(ctx);
      return ctx.scene.leave();
    }

    const chatId = ctx.chat.id;

    await this.botRepository.setTimezone(chatId, text);
    await ctx.reply(`Timezone ${text} was saved`, showMainKeyboard());

    exitScene(ctx);
  }
}
