import { IMyContext } from '../types/myContext.interface';
import { showMainKeyboard } from '../keyboards/main.keyboard';

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

  let message = '';

  if (action === 'create') {
    message = 'You canceled creating of subscription';
  }

  if (action === 'delete') {
    message = 'You canceled deleting of subscription';
  }

  if (action === 'timezone') {
    message = 'You canceled setting a timezone';
  }

  exitScene(ctx);

  await ctx.reply(message, showMainKeyboard());
  return true;
};
