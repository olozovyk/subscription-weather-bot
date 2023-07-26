import { zonedTimeToUtc } from 'date-fns-tz';

export const convertStringToDate = (time: string, timezone?: string) => {
  const arr = time.split(':');
  const hours = parseInt(arr[0]);
  const minutes = parseInt(arr[1]);

  let date = new Date();

  date.setHours(hours);
  date.setMinutes(minutes);

  if (timezone) {
    date = zonedTimeToUtc(date, timezone);
  }

  return date;
};
