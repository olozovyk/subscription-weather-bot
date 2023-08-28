import { Markup } from 'telegraf';

export const showPickLocationKeyboard = (locationsLength: number) => {
  const arr = Array(locationsLength)
    .fill('')
    .map((_: string, idx: number) => String(idx + 1));

  return Markup.keyboard([arr, ['❌ Cancel']]).resize();
};
