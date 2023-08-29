import { IMyContext } from '../types';
import { showMainKeyboard } from '../keyboards';
import { messages } from '../messages';

export const exitScene = (ctx: IMyContext) => {
  if (ctx.session.newSubscription) {
    delete ctx.session.newSubscription;
  }

  if (ctx.session.locations) {
    delete ctx.session.locations;
  }

  if (ctx.session.location) {
    delete ctx.session.location;
  }

  if (ctx.session.timeLocal) {
    delete ctx.session.timeLocal;
  }

  if (ctx.session.subscriptions) {
    delete ctx.session.subscriptions;
  }

  ctx.scene.leave();
};

export const isSceneCanceled = async (
  ctx: IMyContext,
  text: string,
  action: 'create' | 'delete' | 'timezone',
): Promise<boolean | void> => {
  if (text !== '❌ Cancel') return;

  const dict = {
    create: messages.canceledCreating,
    delete: messages.canceledDeleting,
    timezone: messages.canceledSettingTimezone,
  };

  exitScene(ctx);
  await ctx.reply(dict[action], showMainKeyboard());

  return true;
};
