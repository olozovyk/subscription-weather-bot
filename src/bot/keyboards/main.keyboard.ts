import { Markup } from 'telegraf';

export const showMainKeyboard = () => {
  return Markup.keyboard(
    [
      'New subscription',
      'All subscriptions',
      'Delete subscription',
      'Set timezone',
      'Help',
    ],
    {
      columns: 2,
    },
  ).resize(true);
};
