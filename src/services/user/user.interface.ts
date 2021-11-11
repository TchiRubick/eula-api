enum iEnumUserRole { 'admin', 'user' }

export type iUserName = string

export type iUserId = string

export type iUserEmail = string

export type iUserPassword = string

export type iUserRole = iEnumUserRole

export type iUserObjId = {
  _id: iUserId
}

export type iUserFilter = {
  search?: string
}

export type iUser = {
  _id?: iUserId
  name: iUserName
  email: iUserEmail
  password: iUserPassword
  role: iUserRole
}

export type iReqLogin = {
  email: iUserEmail
  password: iUserPassword
}

export type iResUserPublic = {
  _id?: iUserId
  name: iUserName
  email: iUserEmail
  role: iUserRole
}

export type iResLogin = {
  user: iResUserPublic
  token?: string
}
