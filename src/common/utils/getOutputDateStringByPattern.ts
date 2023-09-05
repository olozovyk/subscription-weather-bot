import { formatInTimeZone } from 'date-fns-tz';
import { format } from 'date-fns';

interface IParams {
  pattern: string;
  date?: Date;
  timezone?: string;
}

export const getOutputDateStringByPattern = ({
  pattern,
  date = new Date(),
  timezone,
}: IParams) => {
  if (timezone) {
    return formatInTimeZone(date, timezone, pattern);
  }
  return format(date, pattern);
};
