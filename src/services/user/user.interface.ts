export type iUserName = string;

export type iUserId = string;

export type iUserEmail = string;

export type iUserPassword = string;

export type iUserRole = string;

export type iUserCreatedAt = Date;

export type iUserUpdatedAt = Date;

export type iUser = {
  _id: iUserId
  name: iUserName
  email: iUserEmail
  password: iUserPassword
  role: iUserRole
  createdAt: iUserCreatedAt
  updatedAt: iUserUpdatedAt
};

export type iReqUser = {
  _id?: iUserId
  name: iUserName
  email: iUserEmail
  password: iUserPassword
  role: iUserRole
};

export type iResUserPublic = {
  _id: iUserId
  name: iUserName
  email: iUserEmail
  role: iUserRole
  createdAt: iUserCreatedAt
  updatedAt: iUserUpdatedAt
};

export type iResUserAdmin = iUser
