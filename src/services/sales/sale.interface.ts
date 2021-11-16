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
