declare module Express {
  interface Request {
    locals?: any
    files?: any
  }
  interface Response {
    __?: (message?: string) => tring
  }
}
