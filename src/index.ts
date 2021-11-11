import express from 'express';
import { ValidationError } from 'express-validation';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import createError from 'http-errors';
import bodyParser from 'body-parser';

import logger from '~/utils/logger/logger.util';
import { database } from '~/database/index.database';

import testRoutePublic from '~/routes/test/public/test.route';
import userPublicRoute from '~/routes/user/user.public.route';

require('module-alias/register');

const PORT = process.env.PORT || 5000;

const app = express();

try {
  app.disable('x-powered-by');
  app.use(cookieParser());
  app.use(cors({ origin: [/localhost(:[0-9]+)*/] }));
  app.use('/favicon.ico', express.static('public/favicon.ico'));
  app.use(bodyParser.json());

  database();

  app.use('/api/public/test', testRoutePublic);
  app.use('/api/public/user', userPublicRoute);

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err);
    }

    return next();
  });

  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    next(createError(404));
  });

  app.listen(PORT, () => {
    logger.info(`server running on port ${PORT}`);
  });
} catch (error: any) {
  logger.error(`On Start: ${error.message}`);
  process.exit();
}
