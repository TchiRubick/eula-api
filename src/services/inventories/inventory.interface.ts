export type iInvName = string;

export type iInvBarcode = string;

export type iInvPrice = number;

export type iInvCost = number;

export type iInvQuantity = number;

export type iInvCreatedAt = Date;

export type iInvUpdatedAt = Date;

export type iInv = {
  _id: string
  name: iInvName
  barcode: iInvBarcode
  price: iInvPrice
  cost: iInvCost
  quantity: iInvQuantity
  createdAt: iInvCreatedAt
  updatedAt: iInvUpdatedAt
}

export type iReqInv = {
  _id?: string
  name: iInvName
  barcode: iInvBarcode
  price: iInvPrice
  cost: iInvCost
  quantity: iInvQuantity
}

export type iResInvPublic = {
  _id: string
  name: iInvName
  barcode: iInvBarcode
  price: iInvPrice
  quantity: iInvQuantity
  createdAt: iInvCreatedAt
  updatedAt: iInvUpdatedAt
}

export type iResInvAdmin = iInv
