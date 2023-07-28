import { zonedTimeToUtc } from 'date-fns-tz';

export const convertInputStringToDate = (
  time: string,
  timezone?: string,
): { timeLocal: Date; timeUTC: Date } => {
  const arr = time.split(':');
  const hours = parseInt(arr[0]);
  const minutes = parseInt(arr[1]);

  const timeLocal = new Date();
  let timeUTC = timeLocal;

  timeLocal.setHours(hours);
  timeLocal.setMinutes(minutes);

  if (timezone) {
    timeUTC = zonedTimeToUtc(timeLocal, timezone);
  }

  return {
    timeLocal,
    timeUTC,
  };
};
