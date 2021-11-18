import { iInv } from '~/services/inventories/inventory.interface';
import { iUser } from '~/services/user/user.interface';

export type iSale = {
  inventory: string
  user: string
  prices: number
  quantity: number
  ticket: number
}

export type iSaleRelations = {
  inventory: iInv
  user: iUser
  prices: number
  quantity: number
  ticket: number
}

export type iSaleRelationsInv = {
  inventory: iInv
  user: string
  prices: number
  quantity: number
  ticket: number
}

export type iSaleRelationsUser = {
  inventory: string
  user: iUser
  prices: number
  quantity: number
  ticket: number
}

export type iInvSale = iInv

export type iUserSale = iUser

export interface getOne {
  (where: any | unknown, relations: string[] | undefined): Promise<Error | {
    inventory: string | iInv | Error;
    user: string | iUser | Error;
    prices: number;
    quantity: number;
    ticket: number;
  }>
}

export interface getByDate {
  (where: Date, relations: string[] | undefined): Promise<Error | Promise<getByDateResult>[]>
}

export type getByDateResult = Promise<Error | {
  inventory: string | Error | iInv;
  user: string | Error | iUser;
  prices: number;
  quantity: number;
  ticket: number;
}>
