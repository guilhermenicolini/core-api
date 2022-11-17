
export class BaseError extends Error {
  readonly code?: string
  constructor (name: string, message: string, code?: string) {
    super(message)
    this.name = name
    this.code = code
  }
}
