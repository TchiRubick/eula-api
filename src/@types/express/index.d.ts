export {};

declare global {
  namespace Express {
    interface Request {
       user?: import('~/services/user/user.interface').iResUserPublic
    }
  }
}
