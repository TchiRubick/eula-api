import { Request, Response, NextFunction } from 'express';
import { checkToken } from '~/utils/jwt/jwt.utils';
import logger from '~/utils/logger/logger.util';
import { getOne } from '~/services/user/user.repository';
import { transformToPublic } from '~/services/user/user.transformer';

const protectedCheckMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  if (!req.headers.authorization || req.headers.authorization.length < 8) {
    return res.status(401).json({});
  }

  try {
    const token = req.headers.authorization.slice(7);

    const { _id } = checkToken(token);

    const user = await getOne({ _id });

    if (user instanceof Error) {
      throw user;
    }

    if (user.role !== 'admin' && user.role !== 'super-admin') {
      logger.error('not a admin');
      return res.status(401).json({ error: 'not an admin' });
    }

    req.user = transformToPublic(user);

    return next();
  } catch (e: any) {
    logger.error(`invalid token: ${e.message}`);
    return res.status(401).json({});
  }
};

export default protectedCheckMiddleware;
