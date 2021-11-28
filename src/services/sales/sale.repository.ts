import { ClientSession } from 'mongoose';
import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';

import logger from '~/utils/logger/logger.util';

import Sale, { session as ssTransaction } from './sale.model';
import User from '~/services/user/user.model';
import Inventory from '~/services/inventories/inventory.model';

import * as iS from './sale.interface';

export const session = (): Promise<ClientSession> => ssTransaction;

export const create = async (props: iS.iSale): Promise<iS.iSale | Error> => {
  let result: iS.iSale | Error;

  try {
    const objSale = await new Sale({ ...props });

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

export const update = async (where: any | unknown, params: any | unknown): Promise<iS.iSale | Error> => {
  let result: iS.iSale | Error;

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

export const getLastTicket = async (): Promise<number> => {
  let result = 0;

  try {
    const sale = await Sale.findOne().sort({ field: 'asc', _id: -1 });

    if (sale) {
      result = sale.ticket;
    }
  } catch (error: any) {
    logger.error(error.message);
  }

  return result;
};

export const getOne: iS.getOne = async (where, relations) => {
  try {
    const sale: iS.iSale = await Sale.findOne(where);

    let inventoryResult: iS.iInvSale | Error | undefined;
    let UserResult: iS.iUserSale | Error | undefined;

    if (!sale) {
      throw Error('Sale not found');
    }

    if (!relations) {
      return sale;
    }

    let result: iS.iResult = sale;

    if (relations) {
      if (relations.includes('inventory')) {
        inventoryResult = await getInventoryRelation(sale.inventory);

        if (inventoryResult instanceof Error === false) {
          result = { ...sale, inventory: inventoryResult ?? sale.inventory };
        }
      }

      if (relations.includes('user')) {
        UserResult = await getUserRelation(sale.user);

        if (UserResult instanceof Error === false) {
          result = { ...sale, user: UserResult ?? sale.user };
        }
      }
    }

    return result;
  } catch (error: any) {
    logger.error(error.message);

    return Error(error.message);
  }
};

const getInventoryRelation = async (inventoryId: iS.iSale['inventory']): Promise<iS.iInvSale | Error> => {
  try {
    const inventory: iS.iInvSale = await Inventory.findOne({ _id: inventoryId });

    return inventory;
  } catch (error: any) {
    logger.error(error.message);

    return Error(error.message);
  }
};

const getUserRelation = async (userId: iS.iSale['user']): Promise<iS.iUserSale | Error> => {
  try {
    const user = await User.findOne({ _id: userId });

    return user;
  } catch (error: any) {
    logger.error(error.message);

    return Error(error.message);
  }
};

export const getByDate: iS.getByDate = async (date, relations) => {
  try {
    const searchDate = new Date(date);

    const where = {
      createdAt: {
        $gte: startOfDay(searchDate),
        $lte: endOfDay(searchDate),
      },
    };

    const sale: iS.iSale[] = await Inventory.find(where);

    if (!sale) {
      throw Error('Sale not found');
    }

    const result = sale.map(async (s): Promise<iS.getResultByDate> => {
      let inventoryResult: iS.iInvSale | Error | undefined;
      let UserResult: iS.iUserSale | Error | undefined;
      let finalResult: iS.iResult = { ...s };

      if (relations && relations.includes('inventory')) {
        inventoryResult = await getInventoryRelation(s.inventory);

        if (inventoryResult instanceof Error === false) {
          finalResult = { ...s, inventory: inventoryResult ?? s.inventory };
        }
      }

      if (relations && relations.includes('user')) {
        UserResult = await getUserRelation(s.user);

        if (UserResult instanceof Error === false) {
          finalResult = { ...s, user: UserResult ?? s.user };
        }
      }

      return finalResult;
    });

    return result;
  } catch (error: any) {
    logger.error(error.message);

    return Error(error.message);
  }
};

export const get = async (where: any | unknown): Promise<iS.iSaleDbResultOne[] | Error> => {
  let result: iS.iSaleDbResultOne[] | Error;

  try {
    result = await Sale.find(where);

    return result;
  } catch (error: any) {
    logger.error(error.message);

    return Error(error.message);
  }
};
