import { iInv } from '~/services/inventories/inventory.interface';
import { iUser } from '~/services/user/user.interface';

export type iInput = {
  inventory: string,
  prices: number,
  quantity: number,
}

export type iSale = {
  inventory: string
  user: string
  prices: number
  quantity: number
  ticket: number
  status: string;
}

export type iSaleDbResultOne = {
  _id: string
  inventory: string
  user: string
  prices: number
  quantity: number
  ticket: number
  status: string;
}

export type iResult = {
    inventory: string | Error | iInv;
    user: string | Error | iUser;
    prices: number;
    quantity: number;
    ticket: number;
    status: string;
}

export type iInvSale = iInv

export type iUserSale = iUser

export interface getOne {
  (where: any | unknown, relations: ('inventory' | 'user')[] | undefined): Promise<Error | iResult>
}

export interface getByDate {
  (where: Date, relations: ('inventory' | 'user')[] | undefined): Promise<Error | Promise<getResultByDate>[]>
}

export type getResultByDate = Promise<Error | iResult>
