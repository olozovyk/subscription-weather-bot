import { zonedTimeToUtc } from 'date-fns-tz';

export const getCurrentUTCTime = (): {
  hours: number;
  minutes: number;
} => {
  const date = new Date();
  const utcDate = zonedTimeToUtc(date, 'UTC');

  return {
    hours: utcDate.getHours(),
    minutes: utcDate.getMinutes(),
  };
};
