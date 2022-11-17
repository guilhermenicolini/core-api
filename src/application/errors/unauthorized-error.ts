import { BaseError } from './base-error'

export class UnauthorizedError extends BaseError {
  constructor (message: string, code?: string) {
    super('UnauthorizedError', message, code)
  }
}
