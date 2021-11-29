import _ from 'lodash';

import {
  iUserOutputSalePrivate,
  iUserOutputSale,
  iOutputSale,
  iOutputSalePrivate,
} from '~/services/sales/sale.interface';

export const transformSampleUserToPrivate = (data: iUserOutputSale): iUserOutputSalePrivate => {
  const newData = _.pick(data, ['_id', 'inventories', 'ticket', 'status', 'payed', 'backed', 'createdAt', 'updatedAt']);
  const newUser = _.pick(data.user, ['_id', 'name', 'email', 'role', 'createdAt', 'updatedAt']);

  return { ...newData, user: newUser };
};

export const transformManySampleUserToPrivate = (data: iUserOutputSale[]): iUserOutputSalePrivate[] => (
  data.map(transformSampleUserToPrivate));

export const transformToPrivate = (data: iOutputSale): iOutputSalePrivate => {
  const newData = _.pick(data, ['_id', 'inventories', 'ticket', 'status', 'payed', 'backed', 'createdAt', 'updatedAt']);
  const newUser = _.pick(data.user, ['_id', 'name', 'email', 'role', 'createdAt', 'updatedAt']);

  return { ...newData, user: newUser };
};
