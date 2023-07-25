import { Markup } from 'telegraf';

export const showCancelSceneKeyboard = () => {
  return Markup.keyboard(['❌ Cancel']).resize(true);
};
