import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { BaseScene } from '../base.scene';
import { BotRepository } from '../../bot.repository';
import { showCancelSceneKeyboard, showMainKeyboard } from '../../keyboards';
import { exitScene, isSceneCanceled } from '../../utils';
import { validateTimezone } from '../../../common/utils';
import { IMyContext } from '../../types';
import { getChatId } from '../../utils/getChatId';

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
    try {
      if (await isSceneCanceled(ctx, text, 'timezone')) return;

      if (!validateTimezone(text)) {
        await ctx.reply(
          'Entered setTimezone is not valid. Please send another one or cancel',
          showCancelSceneKeyboard(),
        );
        return;
      }

      const chatId = getChatId(ctx, true);
      if (!chatId) return;

      await this.botRepository.setTimezone(chatId, text);
      await ctx.reply(`Timezone ${text} was saved`, showMainKeyboard());

      exitScene(ctx);
    } catch (e) {
      await ctx.reply(e.message);
      exitScene(ctx);
    }
  }
}
