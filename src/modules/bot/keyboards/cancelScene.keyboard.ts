import { Markup } from 'telegraf';
import { messages } from '../messages';

export const showCancelSceneKeyboard = () => {
  return Markup.keyboard(messages.cancelSceneKeyboard).resize(true);
};
