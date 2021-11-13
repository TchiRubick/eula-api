import _ from 'lodash';

import * as iI from './inventory.interface';

export const transformToPublic = (data: iI.iInv): iI.iResInvPublic => {
  const result = _.pick(data, ['_id', 'name', 'barcode', 'price', 'quantity', 'createdAt', 'updatedAt']);

  return result;
};

export const transformManyToPublic = (data: iI.iInv[]): iI.iResInvPublic[] => (
  data.map(transformToPublic)
);

export const transformToAdmin = (data: iI.iInv): iI.iResInvAdmin => data;

export const transformManyToAdmin = (data: iI.iInv[]): iI.iResInvAdmin[] => (
  data.map(transformToAdmin)
);
