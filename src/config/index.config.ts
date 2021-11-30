import { Secret } from 'jsonwebtoken';

type iConfig = {
  environment: string
  appKey: Secret
  adminDefaultPassword: string
};

export const config: iConfig = {
  environment: process.env.NODE_ENV || 'development',
  appKey: process.env.APP_KEY || '',
  adminDefaultPassword: process.env.ADMIN_DEFAULT_PASSWORD || 'password',
};

export default config;
