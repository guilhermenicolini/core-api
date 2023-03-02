declare module Express {
  interface Request {
    locals?: any
  }
  interface Response {
    __?: (message?: string) => tring
  }
}
