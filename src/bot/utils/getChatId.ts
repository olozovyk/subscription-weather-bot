import { IMyContext } from '../types';
import { exitScene } from './cancelScene';

export const getChatId = (
  ctx: IMyContext,
  isThisScene?: boolean,
): number | void => {
  if (ctx?.chat?.id) {
    return ctx.chat.id;
  }

  if (isThisScene) {
    exitScene(ctx);
  }
};
