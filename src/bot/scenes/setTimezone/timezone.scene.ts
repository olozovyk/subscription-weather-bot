import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { BaseScene } from '../base.scene';
import { BotRepository } from '../../bot.repository';
import { showCancelSceneKeyboard, showMainKeyboard } from '../../keyboards';
import { exitScene, isSceneCanceled } from '../../utils';
import { logCaughtError, validateTimezone } from '../../../common/utils';
import { IMyContext } from '../../types';
import { getChatId } from '../../utils/getChatId';
import { messages } from '../../messages';
import { Logger } from '@nestjs/common';

@Scene('timezoneScene')
export class TimezoneScene extends BaseScene {
  constructor(private botRepository: BotRepository) {
    super();
  }

  private logger = new Logger(TimezoneScene.name);

  @SceneEnter()
  async enter(@Ctx() ctx: IMyContext) {
    await ctx.reply(messages.askForTimezone, showCancelSceneKeyboard());
  }

  @On('text')
  async saveTimezone(@Ctx() ctx: IMyContext, @Message('text') text: string) {
    try {
      if (await isSceneCanceled(ctx, text, 'timezone')) return;

      if (!validateTimezone(text)) {
        await ctx.reply(
          messages.timeFormatIsNotValid,
          showCancelSceneKeyboard(),
        );
        return;
      }

      const chatId = getChatId(ctx, true);
      if (!chatId) return;

      await this.botRepository.setTimezone(chatId, text);
      await ctx.reply(
        messages.getTimezoneSavedString(text),
        showMainKeyboard(),
      );

      exitScene(ctx);
    } catch (e) {
      logCaughtError(e, this.logger);
      exitScene(ctx);
    }
  }
}
