import _ from 'lodash';

import { iUserOutputSalePrivate, iUserOutputSale } from '~/services/sales/sale.interface';

export const transformSampleUserToPrivate = (data: iUserOutputSale): iUserOutputSalePrivate => {
  const newData = _.pick(data, ['_id', 'inventories', 'ticket', 'status', 'payed', 'backed']);
  const newUser = _.pick(data.user, ['_id', 'name', 'email', 'role', 'createdAt', 'updatedAt']);

  return { ...newData, user: newUser };
};

export const transformManySampleUserToPrivate = (data: iUserOutputSale[]): iUserOutputSalePrivate[] => (
  data.map(transformSampleUserToPrivate));
