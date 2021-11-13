import { iResUserPublic, iResUserAdmin, iUser } from './user.interface';

export const transformToPublic = (data: iUser): iResUserPublic => {
  const {
    _id,
    name,
    email,
    role,
  } = data;

  return {
    _id,
    name,
    email,
    role,
  };
};

export const transformManyToPublic = (data: iUser[]): iResUserPublic[] => (
  data.map(transformToPublic)
);

export const transformToAdmin = (data: iUser): iResUserAdmin => data;

export const transformManyToAdmin = (data: iUser[]): iResUserAdmin[] => (
  data.map(transformToAdmin)
);
