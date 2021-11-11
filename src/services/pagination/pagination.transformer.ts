import { iPaginationResponse } from './pagination.interface';

export const transformToPagination = (page: number, size: number, total: number): iPaginationResponse => {
  const totalPage: number = Math.ceil(total / size);

  return {
    page,
    size,
    total,
    totalPage,
  };
};

export default transformToPagination;
