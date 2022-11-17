export class ServerError extends Error {
  readonly innerException: Error | undefined
  constructor (error: Error | undefined) {
    super('An error occurred while processing your request. Please, try again later')
    this.name = 'ServerError'
    this.innerException = error
  }

  toJSON (): string {
    return `${this.message}. Inner error: ${this.innerException?.message as string}`
  }
}
