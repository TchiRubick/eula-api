import logger from '~/utils/logger/logger.util';

import Inventory from './inventory.model';
import * as iI from './inventory.interface';

export const create = async (props: iI.iReqInv): Promise<iI.iInv | Error> => {
  let result: iI.iInv | Error;

  try {
    const objInv = await new Inventory({ ...props });

    result = await objInv.save();

    if (!result) {
      throw Error('Cannot create user');
    }
  } catch (error: any) {
    logger.warning(error.message);

    result = Error(error.message);
  }

  return result;
};

export default create;
