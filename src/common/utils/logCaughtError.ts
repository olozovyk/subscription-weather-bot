import { Logger } from '@nestjs/common';

export const logCaughtError = (e: unknown, logger: Logger) => {
  if (e instanceof Error) {
    logger.error(e.message);
  } else {
    logger.error(JSON.stringify(e));
  }
};
