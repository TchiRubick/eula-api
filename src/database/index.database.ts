import mongoose from 'mongoose';
import logger from '~/utils/logger/logger.util';
import config from './config.database';

export const database = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.database.url, { ...config.database.options });

    if (!conn) {
      throw new Error('Cannot connect to Database');
    }

    logger.info('Connected to Database');
  } catch (e: any) {
    logger.error(`database => ${e.message}`);
    throw new Error('Database error connection');
  }
};

export default database;
