import logger from '~/utils/logger/logger.util';

import Inventory from './inventory.model';
import * as iI from './inventory.interface';

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
