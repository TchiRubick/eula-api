import { iInv } from '~/services/inventories/inventory.interface';
import { iUser, iResUserPublic } from '~/services/user/user.interface';

export type iInputInventory = {
  inventory: string,
  price: number,
  quantity: number,
}

export type iInputSale = {
  inventories: iInputInventory[],
  user: string,
  ticket: number,
  status: string,
  payed: number,
  backed: number,
}

export type iOutputSale = {
  inventories: iInv[],
  user: iUser,
  ticket: number,
  status: string,
  payed: number,
  backed: number,
}

export type iSampleOutputSale = {
  _id: string,
  inventories: iInputInventory[],
  user: string,
  ticket: number,
  status: string,
  payed: number,
  backed: number,
}

export type iUserOutputSale = {
  _id: string,
  inventories: iInputInventory[],
  user: iUser,
  ticket: number,
  status: string,
  payed: number,
  backed: number,
}

export type iUserOutputSalePrivate = {
  _id: string,
  inventories: iInputInventory[],
  user: iResUserPublic,
  ticket: number,
  status: string,
  payed: number,
  backed: number,
}

export type iOutputMoney = {
  _id: null,
  payed: number,
  backed: number,
  total: number,
}

export interface getOne {
  (where: any | unknown): Promise<Error | iOutputSale>
}

export interface getOneNoJoin {
  (where: any | unknown): Promise<Error | iSampleOutputSale>
}

export interface getByDate {
  (date: Date | number, page: number, size: number): Promise<Error | iUserOutputSale[]>
}

export interface getTotalByDateSaled {
  (date: Date | number): Promise<iOutputMoney>
}
