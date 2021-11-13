import _ from 'lodash';

import { iResUserPublic, iResUserAdmin, iUser } from './user.interface';

export const transformToPublic = (data: iUser): iResUserPublic => {
  const result = _.pick(data, ['_id', 'name', 'email', 'role', 'createdAt', 'updatedAt']);

  return result;
};

export const transformManyToPublic = (data: iUser[]): iResUserPublic[] => (
  data.map(transformToPublic)
);

export const transformToAdmin = (data: iUser): iResUserAdmin => data;

export const transformManyToAdmin = (data: iUser[]): iResUserAdmin[] => (
  data.map(transformToAdmin)
);
