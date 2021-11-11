import logger from '~/utils/logger/logger.util';
import { setCrypto } from '~/utils/crypter/crypter.utils';

import User from './user.model';
import * as iU from './user.interface';

export const create = async (props: iU.iUser): Promise<iU.iUser | Error> => {
  let result: iU.iUser | Error;

  try {
    const { password } = props;

    const objUser = await new User({ ...props, password: await setCrypto(password) });

    result = await objUser.save();

    if (!result) {
      throw Error('Cannot create user');
    }
  } catch (error: any) {
    logger.warning(error.message);

    result = Error(error.message);
  }

  return result;
};

export const getOne = async (where: any | unknown): Promise<iU.iUser | Error> => {
  let result: iU.iUser | Error;

  try {
    result = await User.findOne(where);

    if (!result) {
      throw Error('User not found');
    }
  } catch (error: any) {
    logger.warning(error.message);

    result = Error(error.message);
  }

  return result;
};
