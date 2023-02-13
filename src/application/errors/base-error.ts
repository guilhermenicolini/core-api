export class BaseError extends Error {
  readonly innerException: Error | undefined
  constructor (name: string, message: string, error?: Error) {
    super(message)
    this.name = name
    this.innerException = error
  }
}
