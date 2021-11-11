import Logger, { LoggerOptions } from '@ptkdev/logger';
import { config } from '~/config/index.config';

const options: LoggerOptions = {
  language: 'en',
  colors: true,
  debug: config.environment !== 'production',
  info: config.environment !== 'production',
  warning: true,
  error: true,
  sponsor: true,
  write: true,
  type: 'log',
  path: {
    debug_log: './log-debug',
    error_log: './log-errors',
  },
};

const logger = new Logger(options);

export default logger;
