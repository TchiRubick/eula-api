import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';

import logger from '~/utils/logger/logger.util';

import Sale from './sale.model';
import User from '~/services/user/user.model';
import Inventory from '~/services/inventories/inventory.model';

import * as iS from './sale.interface';

export const create = async (props: iS.iSale): Promise<iS.iSale | Error> => {
  let result: iS.iSale | Error;

  try {
    const objSale = await new Sale({ ...props });

    result = await objSale.save();

    if (!result) {
      throw Error('Cannot create a sale note');
    }
  } catch (error: any) {
    logger.warning(error.message);

    result = Error(error.message);
  }

  return result;
};

export const getOne = async (where: any | unknown): Promise<iS.iSale | Error> => {
  let result: iS.iSale | Error;

  try {
    result = await Sale.findOne(where);

    if (!result) {
      throw Error('Sale not found');
    }
  } catch (error: any) {
    logger.warning(error.message);

    result = Error(error.message);
  }

  return result;
};

export const getOneWithUser = async (where: any | unknown): Promise<iS.iSaleRelationsUser | Error> => {
  let result: iS.iSaleRelationsUser | Error;

  try {
    const sale = await Sale.findOne(where);

    if (!sale) {
      throw Error('Sale not found');
    }

    const user = await User.findOne({ _id: sale.user });

    if (!user) {
      throw Error('User Sale not found');
    }

    result = { ...sale, user };
  } catch (error: any) {
    logger.error(error.message);

    result = Error(error.message);
  }

  return result;
};

export const getOneWithInventory = async (where: any | unknown): Promise<iS.iSaleRelationsInv | Error> => {
  let result: iS.iSaleRelationsInv | Error;

  try {
    const sale = await Sale.findOne(where);

    if (!sale) {
      throw Error('Sale not found');
    }

    const inventory = await Inventory.findOne({ _id: sale.inventory });

    if (!inventory) {
      throw Error('Inventory Sale not found');
    }

    result = { ...sale, inventory };
  } catch (error: any) {
    logger.error(error.message);

    result = Error(error.message);
  }

  return result;
};

export const getOneWithAll = async (where: any | unknown): Promise<iS.iSaleRelations | Error> => {
  let result: iS.iSaleRelations | Error;

  try {
    const sale = await Sale.findOne(where);

    if (!sale) {
      throw Error('Sale not found');
    }

    const inventory = await Inventory.findOne({ _id: sale.inventory });

    if (!inventory) {
      throw Error('Inventory Sale not found');
    }

    const user = await User.findOne({ _id: sale.user });

    if (!user) {
      throw Error('User Sale not found');
    }

    result = { ...sale, inventory, user };
  } catch (error: any) {
    logger.error(error.message);

    result = Error(error.message);
  }

  return result;
};

export const getByDate = async (date: string):
Promise<iS.iSaleRelationsUser[] | Error | Promise<iS.iSaleRelationsUser>[]> => {
  let result: iS.iSaleRelationsUser[] | Error | Promise<iS.iSaleRelationsUser>[];

  try {
    const searchDate = new Date(date);

    const where = {
      createdAt: {
        $gte: startOfDay(searchDate),
        $lte: endOfDay(searchDate),
      },
    };

    const sale = await Inventory.find(where);

    if (!sale) {
      throw Error('Inventories not found');
    }

    result = sale.map(async (s: iS.iSale) => {
      const user = await User.findOne({ _id: s.user });

      if (!user) {
        throw Error('User Sale not found');
      }

      return { ...s, user };
    });
  } catch (error: any) {
    logger.error(error.message);

    result = Error(error.message);
  }

  return result;
};
