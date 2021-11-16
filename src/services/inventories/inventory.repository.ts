import logger from '~/utils/logger/logger.util';

import Inventory from './inventory.model';
import * as iI from './inventory.interface';
import { likeFormatter, escapeRegexString } from '~/helpers/index.helper';

export const create = async (props: iI.iReqInv): Promise<iI.iInv | Error> => {
  let result: iI.iInv | Error;

  try {
    const objInv = await new Inventory({ ...props });

    result = await objInv.save();

    if (!result) {
      throw Error('Cannot create inventorie');
    }
  } catch (error: any) {
    logger.warning(error.message);

    result = Error(error.message);
  }

  return result;
};

export const getOne = async (where: any | unknown): Promise<iI.iInv | Error> => {
  let result: iI.iInv | Error;

  try {
    result = await Inventory.findOne(where);

    if (!result) {
      throw Error('Inventorie not found');
    }
  } catch (error: any) {
    logger.warning(error.message);

    result = Error(error.message);
  }

  return result;
};

export const updateOne = async (where: any | unknown, params: iI.iReqUpdateInv): Promise<iI.iInv | Error> => {
  let result: iI.iInv | Error;

  try {
    result = await Inventory.findOneAndUpdate(where, params, {
      new: true,
    });

    if (!result) {
      throw Error('Inventorie not updated');
    }
  } catch (error: any) {
    logger.warning(error.message);

    result = Error(error.message);
  }

  return result;
};

export default create;

export const getByFilter = async (search?: string, page?: number, size = 30): Promise<iI.iInv[] | Error> => {
  let result: iI.iInv[] | Error;

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
          { barcode: { $regex: likeSearch, $options: 'i' } },
          { name: { $regex: likeSearch, $options: 'i' } },
        ],
      };
    }

    result = await Inventory.find(where, null, { skip, limit: size });

    if (!result) {
      throw Error('Inventories not found');
    }
  } catch (error: any) {
    logger.warning(error.message);

    result = Error(error.message);
  }

  return result;
};

export const getCount = async (where?: any | unknown): Promise<number> => {
  const count: number = await Inventory.countDocuments(where ?? null);

  return count ?? 0;
};
