import jwt from 'jsonwebtoken';
import logger from '~/utils/logger/logger.util';
import { config } from '~/config/index.config';

export const setToken = (data: any | unknown): string => jwt.sign(data, config.appKey);

export const checkToken = (token: string): any | Error => {
  try {
    const clearedToken = token.replace('Bearer ', '');
    const decoded = jwt.verify(clearedToken, config.appKey);
    return decoded;
  } catch (error: any) {
    logger.error(error.message);
    return error;
  }
};
