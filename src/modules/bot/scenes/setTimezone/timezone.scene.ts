import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { Logger } from '@nestjs/common';

import { BaseScene } from '../base.scene';
import { showCancelSceneKeyboard, showMainKeyboard } from '../../keyboards';
import { exitScene, getChatId, isSceneCanceled } from '../../utils';
import { logCaughtError, validateTimezone } from '../../../../common/utils';
import { IMyContext } from '../../types';
import { messages } from '../../messages';
import { UserService } from '../../../user/user.service';

@Scene('timezoneScene')
export class TimezoneScene extends BaseScene {
  constructor(private readonly usersService: UserService) {
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
        await ctx.reply(messages.timezoneIsNotValid, showCancelSceneKeyboard());
        return;
      }

      const chatId = getChatId(ctx, true);
      if (!chatId) return;

      await this.usersService.setTimezone(chatId, text);
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
