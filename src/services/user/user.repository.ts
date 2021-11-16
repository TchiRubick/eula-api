import logger from '~/utils/logger/logger.util';
import { setCrypto } from '~/utils/crypter/crypter.utils';
import { likeFormatter, escapeRegexString } from '~/helpers/index.helper';

import User from './user.model';
import * as iU from './user.interface';

export const create = async (props: iU.iReqUser): Promise<iU.iUser | Error> => {
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

export const getByFilter = async (search?: string, page?: number, size = 30): Promise<iU.iUser[] | Error> => {
  let result: iU.iUser[] | Error;

  try {
    let skip = 0;

    if (page) {
      skip = (page - 1) * size;
    }

    let where: any;

    if (search) {
      const escapedSearch = escapeRegexString(search);
      const likeSearch = likeFormatter(escapedSearch);

      where = {
        $or: [
          { name: { $regex: likeSearch, $options: 'i' } },
          { email: { $regex: likeSearch, $options: 'i' } },
          { role: { $regex: likeSearch, $options: 'i' } },
        ],
      };
    }

    result = await User.find(where, null, { skip, limit: size });

    if (!result) {
      throw Error('Users not found');
    }
  } catch (error: any) {
    logger.warning(error.message);

    result = Error(error.message);
  }

  return result;
};

export const getCount = async (where?: any | unknown): Promise<number> => {
  const count: number = await User.countDocuments(where ?? null);

  return count ?? 0;
};

export const updateOne = async (where: any | unknown, params: iU.iReqUpdateUser): Promise<iU.iUser | Error> => {
  let result: iU.iUser | Error;

  try {
    result = await User.findOneAndUpdate(where, params, {
      new: true,
    });

    if (!result) {
      throw Error('User not updated');
    }
  } catch (error: any) {
    logger.error(error.message);

    result = Error(error.message);
  }

  return result;
};

export const coldRemove = async (_id: iU.iUserId): Promise<boolean> => {
  let result = false;

  try {
    result = await User.findOneAndUpdate({ _id }, { role: 'removed' }, {
      new: false,
    });
  } catch (error: any) {
    logger.error(error.message);
  }

  return result;
};
