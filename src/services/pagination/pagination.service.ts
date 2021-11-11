import { transformToPagination } from './pagination.transformer';
import { iPaginationResponse } from './pagination.interface';

export const getPaginationStats = (page?: number, size = 30, total?: number): iPaginationResponse => {
  const transformPage = page ?? 0;
  const transformSize = size ?? 0;
  const transformTotal = total ?? 0;

  return transformToPagination(transformPage, transformSize, transformTotal);
};

export default getPaginationStats;
