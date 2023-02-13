declare module Express {
  interface Response {
    __?: (message?: string) => tring
  }
}
