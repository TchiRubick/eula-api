import { iResUserPublic, iUser } from './user.interface';

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
