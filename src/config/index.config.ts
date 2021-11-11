import { Secret } from 'jsonwebtoken';

type iConfig = {
  environment: string
  appKey: Secret
};

export const config: iConfig = {
  environment: process.env.NODE_ENV || 'development',
  appKey: process.env.APP_KEY || '',
};

export default config;
