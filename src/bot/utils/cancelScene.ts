import { IMyContext } from '../types/myContext.interface';
import { showMainKeyboard } from '../keyboards/main.keyboard';

export const cancelScene = async (ctx: IMyContext, action: 'create') => {
  let message = '';
  if (action === 'create') {
    message = 'You canceled creating subscription';
  }

  if (ctx.session.newUser) {
    ctx.session.newUser = {};
  }

  await ctx.reply(message, showMainKeyboard());
  return ctx.scene.leave();
};
