export abstract class BaseError extends Error {
  readonly innerException: Error | undefined
  constructor (name: string, message: string, error?: Error) {
    super(message)
    this.name = name
    this.innerException = error
  }

  toJSON (): string {
    return `${this.message}. Inner error: ${this.innerException?.message as string}`
  }
}
