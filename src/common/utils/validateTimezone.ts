import { findTimeZone } from 'timezone-support';
import { Logger } from '@nestjs/common';

export const validateTimezone = (timezone: string): boolean | undefined => {
  const logger = new Logger('validateTimezone');

  try {
    findTimeZone(timezone);
    return true;
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.message);
    }
  }
};
