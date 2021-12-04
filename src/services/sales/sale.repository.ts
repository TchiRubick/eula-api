import { ClientSession } from 'mongoose';
import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';

import logger from '~/utils/logger/logger.util';

import Sale, { session as ssTransaction } from './sale.model';
// import { likeFormatter, escapeRegexString } from '~/helpers/index.helper';

import * as iS from './sale.interface';

export const session = (): Promise<ClientSession> => ssTransaction;

export const create = async (props: iS.iInputSale): Promise<iS.iSampleOutputSale | Error> => {
  let result: iS.iSampleOutputSale | Error;

  try {
    const objSale = await new Sale(props);

    result = await objSale.save();

    if (!result) {
      throw Error('Cannot create a sale note');
    }
  } catch (error: any) {
    logger.error(error.message);

    result = Error(error.message);
  }

  return result;
};

export const update = async (where: any | unknown, params: any | unknown): Promise<iS.iSampleOutputSale | Error> => {
  let result: iS.iSampleOutputSale | Error;

  try {
    result = await Sale.findOneAndUpdate(where, params, {
      new: true,
    });

    if (!result) {
      throw Error('Sale not updated');
    }
  } catch (error: any) {
    logger.error(error.message);

    result = Error(error.message);
  }

  return result;
};

export const getLastTicket = async (where: any | unknown): Promise<iS.iSampleOutputSale | Error> => {
  let result: iS.iSampleOutputSale | Error;

  try {
    result = await Sale.findOne(where).sort({ field: 'asc', _id: -1 });
  } catch (error: any) {
    logger.error(error.message);

    result = error;
  }

  return result;
};

export const getByDate: iS.getByDate = async (date, page, size = 30) => {
  let result: iS.iUserOutputSale[] | Error;

  try {
    const skip = page ? (page - 1) * size : 0;

    result = await Sale.find({
      createdAt: {
        $gte: startOfDay(date),
        $lte: endOfDay(date),
      },
    }, null, { skip, limit: size }).populate('user');
  } catch (error: any) {
    logger.error(error.message);

    result = Error(error.message);
  }

  return result;
};

export const getOneNoJoin: iS.getOneNoJoin = async (where) => {
  try {
    const result: iS.iSampleOutputSale = await Sale.findOne(where);

    return result;
  } catch (error: any) {
    logger.error(error.message);

    return Error(error.message);
  }
};

export const getOne: iS.getOne = async (where) => {
  try {
    const result: iS.iOutputSale = await Sale.findOne(where).populate(['user', 'inventories.inventory']);

    return result;
  } catch (error: any) {
    logger.error(error.message);

    return Error(error.message);
  }
};

export const getCount = async (where?: any | unknown): Promise<number> => {
  const count: number = await Sale.countDocuments(where || {});

  return count ?? 0;
};

export const getTotalByDateSaled: iS.getTotalByDateSaled = async (date) => {
  let result: iS.iOutputMoney = {
    _id: null,
    payed: 0,
    backed: 0,
    total: 0,
  };

  try {
    const totalResult: any = await Sale.aggregate([
      { $match: { $and: [{ createdAt: { $gt: startOfDay(date), $lt: endOfDay(date) } }, { status: 'saled' }] } },
      {
        $group: {
          _id: null,
          payed: { $sum: '$payed' },
          backed: { $sum: '$backed' },
        },
      },
      {
        $addFields: {
          total: { $subtract: ['$payed', '$backed'] },
        },
      },
    ]);

    const [dataSale] = totalResult;

    result = dataSale;
  } catch (error: any) {
    logger.error(error.message);
  }

  return result;
};
