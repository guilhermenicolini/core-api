import { BaseError } from './base-error'

export class BadRequestError extends BaseError {
  constructor (message: string, error?: Error) {
    super('BadRequestError', message, error)
  }
}
