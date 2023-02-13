import { BaseError } from './base-error'

export class UnauthorizedError extends BaseError {
  constructor (message: string, error?: Error) {
    super('UnauthorizedError', message, error)
  }
}
