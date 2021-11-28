import { iInput, iSale } from '~/services/sales/sale.interface';

export const transformCreationToDb = (input: iInput, ticket: number, user: string, inventory: string): iSale => ({
  ...input,
  ticket,
  user,
  inventory,
  status: 'saled',
});

export default transformCreationToDb;
