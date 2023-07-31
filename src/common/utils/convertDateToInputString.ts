import { formatInTimeZone } from 'date-fns-tz';
import { format } from 'date-fns';

export const convertDateToInputString = (date: Date, timezone: string) => {
  if (timezone) {
    return formatInTimeZone(date, timezone, 'HH:mm');
  }
  return format(date, 'HH:mm');
};
