import { Markup } from 'telegraf';
import { messages } from '../messages';

export const showMainKeyboard = () => {
  return Markup.keyboard(messages.mainKeyboard, {
    columns: 2,
  }).resize(true);
};
